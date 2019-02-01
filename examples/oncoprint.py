import json

from solvebio.contrib.dash import SolveBioDash

import solvebio_dash_components as sdc

app = SolveBioDash(
    name=__name__,
    title='OncoPrint')

oncoprint_data = json.dumps([
    {
        'sample': 'SAMPLE-1',
        'alteration': 'AMP',
        'gene': 'GENE',
        'type': 'CNA'
    },
    {
        'sample': 'SAMPLE-1',
        'alteration': 'FUSION',
        'gene': 'GENE',
        'type': 'FUSION'
    },
    {
        'sample': 'SAMPLE-2',
        'gene': 'GENE1'
    },
    {
        'gene': 'GENE2'
    },
])

app.layout = sdc.DashOncoPrint(
    data=oncoprint_data,
    height=1000)

if __name__ == '__main__':
    app.run_server()
