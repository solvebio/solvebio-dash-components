from solvebio.contrib.dash import SolveBioDash

import solvebio_dash_components as sdc

app = SolveBioDash(
    name=__name__,
    title='DashReactSelect')

app.layout = sdc.DashReactSelect(
    id='dash-react-select',
    options=[
        {'label': 'a', 'value': 'a'},
        {'label': 'b', 'value': 'b'},
        {'label': 'c', 'value': 'c'}
    ])

if __name__ == '__main__':
    app.run_server()
