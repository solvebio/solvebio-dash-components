import dash_html_components as html

from solvebio.contrib.dash import SolveBioDash
import solvebio_dash_components as sdc


PROJECTS_VAULT = 'Projects'

app = SolveBioDash(
    name=__name__,
    title='Oncology NGS Report App',
    # app_url='http://127.0.0.1:8050',
    app_url='https://ngs-report-stag.apps.solvebio.net',
    client_id='0lxt2cuv78f9a2zynlpqgxoc3o1pgb4whwd5z5wk')

# APP
app.layout = html.Div(sdc.DashReactTable())

if __name__ == '__main__':
    app.run_server(debug=True)
