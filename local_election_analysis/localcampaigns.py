from dataclasses import dataclass, asdict
import math
import json
import collections

import numpy as np
import pandas as pd
from sklearn import preprocessing
from sklearn.metrics import pairwise_distances
import slugify

import campaignlabprojects as clp

pd.reset_option('all')

def get_constit_scores(year=19, compare_year=17):
    election_results = clp.read_in_election_results()

    uns = clp.score_campaigns_uns(
        election_results[year], election_results[compare_year]
    )

    scores = pd.concat(
        [election_results[year]["Constituency"], uns["difference"]],
        axis=1,
        verify_integrity=True,
        sort=True,
    )
    scores.columns = ["Constituency", "uns"]
    return scores


def get_demographic_data(scores):
    census = clp.read_in_census()

    features = [
        "c11PopulationDensity",
        "c11HouseOwned",
        "c11CarsNone",
        "c11EthnicityWhite",
        "c11Unemployed",
        "c11Retired",
        "c11FulltimeStudent",
        "c11Age65to74",
        "c11DeprivedNone",
    ]
    demographic_data = census[features]

    # only want rows we have election data for
    demographic_data = demographic_data.loc[scores.index]

    # only want constituencies we have complete data for
    demographic_data = demographic_data.dropna()

    # Speaker seats have incomplete voting data
    speaker_seats = census.index[
        census["constituency_name"].isin(["Chorley", "Buckingham"])
    ]
    demographic_data = demographic_data.drop(speaker_seats)

    loss = set(census.index) - set(demographic_data.index)
    print("Loss =", len(loss))

    constits_id = demographic_data.index
    constits_name = list(census.loc[constits_id]["constituency_name"])
    return demographic_data, constits_id, constits_name


def distance(X):
    X_scaled = preprocessing.scale(X)
    return pairwise_distances(X_scaled)


def cut(r, cutoff=1):
    r_cut = np.copy(r)
    r_cut[r > cutoff] = np.inf
    return r_cut


def exponent(r, base=math.e):
    return -1 + base**r


def calc_dist_matrix(demographic_data, rescale=None, **kwargs):
    dist_matrix = distance(demographic_data)
    if rescale:
        dist_matrix = rescale(dist_matrix, **kwargs)
    return dist_matrix


def calc_score_matrix(scores):
    scores_scaled = preprocessing.scale(scores)
    score_matrix = scores_scaled[:, np.newaxis] - scores_scaled
    return score_matrix


def calc_significance_matrix(demographic_data, constit_scores, rescale=None, **kwargs):
    assert np.all(demographic_data.index == constit_scores.index)
    dist_matrix = calc_dist_matrix(demographic_data, rescale, **kwargs)
    score_matrix = calc_score_matrix(constit_scores)

    significance = np.zeros(dist_matrix.shape)
    np.divide(score_matrix, dist_matrix, where=dist_matrix != 0, out=significance)
    return significance


def calc_campaign_conf(demographic_data, constit_scores, rescale=None, **kwargs):
    significance = calc_significance_matrix(
        demographic_data, constit_scores, rescale, **kwargs
    )

    confidences = np.sum(significance, 1)
    confidences = preprocessing.scale(confidences)
    return confidences


def calc_local_density(demographic_data, rescale=None, **kwargs):
    dist_matrix = calc_dist_matrix(demographic_data, rescale, **kwargs)
    local_density = np.zeros(dist_matrix.shape)
    np.divide(
        np.ones(dist_matrix.shape),
        dist_matrix,
        where=dist_matrix != 0,
        out=local_density,
    )
    return pd.Series(np.sum(local_density, 1), index=constits_id)


def list_similar(constit, N=5):
    index = id_to_index[constit]
    dists = dist_matrix[index]
    close_indexes = np.argsort(dists)

    df = pd.DataFrame({"name": id_to_name[constit], "distance": 0}, index=[constit])

    for i in range(1, N + 1):
        j = close_indexes[i]
        df = df.append(
            pd.DataFrame(
                {"name": constits_name[j], "distance": dists[j]}, index=[constits_id[j]]
            )
        )
    return df


def list_significances(constit, significance_matrix, scores, N=5):
    index = id_to_index[constit]
    dists = perc_dist_matrix[index]
    significances = significance_matrix[index]
    most_signif = np.argsort(-abs(significances))

    df = pd.DataFrame(
        {
            "name": id_to_name[constit],
            "distance": 0,
            "election swing": scores.loc[constit],
            "score contribution": 0,
        },
        index=[constit],
    )

    for i in range(N):
        j = most_signif[i]
        df = df.append(
            pd.DataFrame(
                {
                    "name": constits_name[j],
                    "distance": dists[j],
                    "election swing": scores[constits_id[j]],
                    "score contribution": significances[j],
                },
                index=[constits_id[j]],
            )
        )
    return df


def calc_nearby_good_matrix(demographic_data, results):
    dist_matrix = calc_dist_matrix(demographic_data, exponent, base=10)
    relevance_matrix = np.zeros(dist_matrix.shape)
    np.divide(np.array(results), dist_matrix, where=dist_matrix != 0, out=relevance_matrix)
    return relevance_matrix


def perc_similarity(dist_matrix):
    max_ = dist_matrix.max()
    return 100 * (1 - (dist_matrix / max_))


def get_message(result):
    if result < -1:
        m = "did not fare as well as"
    elif result < 0:
        m = "performed close to average compared to"
    elif result < 1.5:
        m = "performed better than"
    else:
        m = "performed extremely well compared to"
    suffix = "other similar constituencies in the last election."
    return " ".join([m, suffix])


@dataclass
class Connection:
    slug: str
    swing: float
    dist: float
    perc_dist: float
    relevance: float
    score_contribution: float


def list_relevant_connections(constit, relevance_matrix, N=5):
    index = id_to_index[constit]
    relevances = relevance_matrix[index]
    most_signif = np.argsort(-relevances)
    connections = []
    for i in range(N):
        j = most_signif[i]
        connection = Connection(
                slug=slugify.slugify(constits_name[j]),
                swing=scores.loc[constits_id[j], 'uns'],
                dist=dist_matrix[index, j],
                perc_dist=perc_dist_matrix[index, j],
                relevance=relevance_matrix[index, j],
                score_contribution=significance_matrix[index, j],
        )
        connections.append(asdict(connection))
    return connections


@dataclass
class Constituency:
    id: str
    name: str
    slug: str
    swing: float
    model_result: float
    message: str
    connections: []

def round_floats(o, n=3):
    if isinstance(o, float):
        return round(o, n)
    if isinstance(o, dict):
        return {k: round_floats(v) for k, v in o.items()}
    if isinstance(o, (list, tuple)):
        return [round_floats(x) for x in o]
    return o

if __name__ == "__main__":
    scores = get_constit_scores()
    demographic_data, constits_id, constits_name = get_demographic_data(scores)
    scores = scores.loc[constits_id]  # only interested in these constits now

    id_to_name = {id_: name for id_, name in zip(constits_id, constits_name)}
    name_to_id = {name: id_ for id_, name in zip(constits_id, constits_name)}
    id_to_index = {onsid: i for i, onsid in enumerate(constits_id)}
    name_to_index = {name: i for i, name in enumerate(constits_name)}

    dist_matrix = distance(demographic_data)
    perc_dist_matrix = perc_similarity(dist_matrix)

    results = pd.DataFrame(
        {
            "constituency": constits_name,
            "uns_exp": calc_campaign_conf(
                demographic_data, scores["uns"], rescale=exponent, base=10
            ),
        },
        index=constits_id,
    )

    local_density = calc_local_density(demographic_data, rescale=exponent, base=10)

    uns_exp_density = results["uns_exp"] / local_density
    uns_exp_density = preprocessing.scale(uns_exp_density)

    results["uns_exp_density"] = uns_exp_density
    results["density"] = local_density

    significance_matrix = calc_significance_matrix(
        demographic_data, scores["uns"], rescale=exponent, base=5
    )

    relevance_matrix = calc_nearby_good_matrix(
            demographic_data, results["uns_exp_density"],
    )
    out = {}
    for i, name in id_to_name.items():
        model_result = results.loc[i, 'uns_exp_density']
        slug = slugify.slugify(name)
        constit = Constituency(
                id=i,
                name=name,
                slug=slug,
                swing=scores.loc[i, 'uns'],
                model_result=model_result,
                message=get_message(model_result),
                connections=list_relevant_connections(i, relevance_matrix, N=5)
        )
        out[slug] = asdict(constit)

    json.dump(
        round_floats(out), 
        open('analysis.json', 'w'),
        indent=4
    )

    mentions = []

    for i in out:
        mentions += [out[i]['message']]
    print()
    print('Distribution of result messages')
    for m, count in collections.Counter(mentions).items():
        print(count, m)
    print()
