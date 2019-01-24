import json

from solvebio.contrib.dash import SolveBioDash

import solvebio_dash_components as sdc

app = SolveBioDash(
    name=__name__,
    title='OncoPrint')

# oncoprint_data = json.dumps([
#     {
#         'sample': 'TCGA-25-2392-01',
#         'gene': 'TP53',
#         'alteration': 'FUSION',
#         'type': 'FUSION',
#     },
#     {
#         'sample': 'TCGA-25-2393-01',
#         'gene': 'TP53',
#         'alteration': 'FUSION',
#         'type': 'FUSION',
#     }
# ])

oncoprint_data = json.dumps([
    {
        'sample': u'2-599672',
        'alteration': u'AMP',
        'gene': u'MATR3',
        'type': 'CNA'
    },
    {
        'sample': u'2-599672',
        'alteration': u'FUSION',
        'gene': u'MATR3',
        'type': 'FUSION'
    },
    {
        'sample': u'2-599673',
        'alteration': u'FUSION',
        'gene': u'MATR3',
        'type': 'FUSION'
    }
])

app.layout = sdc.DashOncoPrint(data=oncoprint_data)

if __name__ == '__main__':
    app.run_server(debug=True)
