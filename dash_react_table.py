import json

import pandas as pd

import plotly.graph_objs as go

from flask import g

from dash.dependencies import Input, Output, State
import dash_core_components as dcc
import dash_html_components as html

from solvebio.contrib.dash import SolveBioDash
import solvebio_dash_components as sdc

app = SolveBioDash(
    name=__name__,
    title='React Table Component',
    app_url='http://127.0.0.1:8050',
    client_id='2ldl2k7wm6qvhivxrqe6ek3qbdyp4iuyeke45jnr')

app.layout = html.Div([
    dcc.Location(id='url', refresh=False),
    html.Div(id='dataset-filters', children=[
        html.Div(
            dcc.Dropdown(
                id='projects',
                placeholder='Select Project',
                options=[{'disabled': True}],
                disabled=True),
            style={'margin-bottom': '10px',
                   'width': '40%'}),
        html.Div(
            dcc.Dropdown(
                id='datasets',
                placeholder='Select Dataset',
                options=[{'disabled': True}],
                disabled=True),
            style={'margin-bottom': '10px',
                   'width': '40%'}),
        html.Div(
            dcc.Dropdown(
                id='samples',
                placeholder='Select Sample',
                options=[{'disabled': True}],
                disabled=True),
            style={'margin-bottom': '10px',
                   'width': '40%'}),
        'Significance: ',
        dcc.Checklist(
            id='significance-filters',
            options=[
                {'label': 'Known', 'value': 'known'},
                {'label': 'Likely', 'value': 'likely'},
                {'label': 'Unknown', 'value': 'unknown'}
            ],
            values=['known', 'likely'],
            labelStyle={'display': 'inline-block', 'margin-right': '5px'}
        ),
        'Hide "likely" with AF below: ',
        dcc.Input(
            id='likely-min-af-filter',
            placeholder='Minimum AF for "likely" significant',
            type='text',
            value='0.5'
        )
    ], style={'margin-bottom': '10px'}),
    html.Div(id='page-content'),
    # sdc.DashReactTable(id='react-table', data='hi'),

    sdc.DashPackageLoader()],
    style={'margin': '30px 80px 30px 80px'})


@app.callback(
    Output('samples', 'disabled'),
    [Input('samples', 'options')])
def enable_samples(samples):
    return False if 'value' in samples[0] else True


@app.callback(
    Output('samples', 'options'),
    [Input('datasets', 'value')])
def load_all_samples(dataset_id):
    if dataset_id:
        dataset = g.client.Dataset.retrieve(dataset_id)
        samples = dataset.query().facets('sample')['sample']
        return [{'label': s[0], 'value': s[0]}
                for s in samples]
    else:
        return [{'disabled': True}]


@app.callback(
    Output('datasets', 'disabled'),
    [Input('datasets', 'options')])
def enable_datasets(datasets):
    return False if 'value' in datasets[0] else True


@app.callback(
    Output('datasets', 'options'),
    [Input('projects', 'value')])
def load_all_datasets(project):
    if project:
        vault = g.client.Vault.get_by_full_path('solvebio:AZ-NGS')
        # DHP: Better way to query for datasets?
        datasets = vault.objects(
            regex='/WIP/{}/'.format(project),
            object_type='dataset')
        return [{'label': d.filename, 'value': d.id}
                for d in datasets]
    else:
        return [{'disabled': True}]


@app.callback(
    Output('projects', 'disabled'),
    [Input('projects', 'options')])
def enable_projects(projects):
    return False if 'value' in projects[0] else True


@app.callback(
    Output('projects', 'options'),
    [Input('url', 'pathname')])
def load_all_projects(_):
    vault = g.client.Vault.get_by_full_path('solvebio:AZ-NGS')
    projects = vault.objects(regex='/WIP/', object_type='folder')
    return [{'label': p.filename, 'value': p.filename}
            for p in projects]


with open('filters.json') as f:
    filters = json.load(f)['filters']
    for i in filters:
        if 'vardict2mut' in i:
            vardict2mut_filters = i['vardict2mut']


def query_dataset(dataset_id, sample, filters):
    global vardict2mut_filters

    dataset = g.client.Dataset.retrieve(dataset_id)
    fields = ['gene', 'amino_acid_change', 'cdna_change', 'type',
              'significance', 'reason', 'allelefreq',
              'depth', 'dkfzbias_summary', 'variant',
              'incidentalome_list', 'chr', 'ref', 'alt', 'start', 'var_type']
    query = dataset.query(filters=[vardict2mut_filters],
                          fields=fields, page_size=10000)

    if sample:
        query = query.filter(sample=sample)

    if filters:
        query = query.filter(filters)

    df = pd.DataFrame.from_records(list(query))
    return dataset, df


@app.callback(
    Output('page-content', 'children'),
    [Input('samples', 'value'),
     Input('significance-filters', 'values'),
     Input('likely-min-af-filter', 'value')],
    [State('datasets', 'value')])
def display_page(sample, significance_filters, likely_min_af, dataset_id):
    if sample:
        COLUMNS = [
            {
                'Header': 'Links',
                'columns': [
                    {
                        'Header': 'SolveBio',
                        'accessor': 'variant',
                        'url': 'https://my.solvebio.com/variant/',
                        'label': 'SolveBio',
                        'Cell': 'url'
                    },
                    {
                        'Header': 'NGB',
                        'accessor': 'variant'
                    },
                    {
                        'Header': 'dbSNP',
                        'accessor': 'variant'
                    }
                ]
            },
            {
                'Header': 'Data',
                'columns': [
                    {
                        'Header': 'Gene',
                        'accessor': 'Gene'
                    }, {
                        'Header': 'AA change',
                        'accessor': 'AA change'
                    }, {
                        'Header': 'Position',
                        'accessor': 'Position'
                    }, {
                        'Header': 'Change',
                        'accessor': 'Change'
                    }, {
                        'Header': 'cDNA change',
                        'accessor': 'cDNA change'
                    }, {
                        'Header': 'Effect',
                        'accessor': 'Effect'
                    }, {
                        'Header': 'Significance',
                        'accessor': 'Significance'
                    }, {
                        'Header': 'Freq',
                        'accessor': 'Freq'
                    }, {
                        'Header': 'Damage bias',
                        'accessor': 'Damage bias'
                    }, {
                        'Header': 'Callability issues',
                        'accessor': 'Callability issues'
                    }
                ]
            }
        ]

        if significance_filters:
            filters = {'or': []}
            for s in significance_filters:
                if s == 'likely':
                    try:
                        likely_min_af = float(likely_min_af)
                    except:
                        likely_min_af = 100.0

                    filters['or'].append({
                        'and': [
                            ['significance', 'likely'],
                            ['allelefreq__gte',
                             likely_min_af / 100.0]
                        ]
                    })
                else:
                    filters['or'].append(
                        ['significance', s]
                    )
        else:
            filters = None

        dataset, df = query_dataset(dataset_id, sample=sample, filters=filters)

        # Allele frequency formatting
        df['allelefreq'] = df['allelefreq'] * 100.0
        df = df.round({'allelefreq': 2})

        # Sort initially by allele frequency
        df = df.sort_values('allelefreq', ascending=False)
        df = df.reset_index(drop=True)

        # Select (highlight) "known" variants by default
        selected_row_indices = df.index[df.loc[:, 'significance'] == 'known']
        # Highlight known and likely, if unknown is included
        if 'unknown' in significance_filters:
            selected_row_indices = df.index[
                df.loc[:, 'significance'].isin(['known', 'likely'])
            ]

        # Position, Change, Significance
        df['change'] = df.apply(
            lambda r: '{} {}>{}'.format(r['var_type'], r['ref'], r['alt']),
            axis=1)
        df['nuc_change'] = df.apply(
            lambda r: '{}>{}'.format(r['ref'], r['alt']),
            axis=1)
        df['position'] = df.apply(
            lambda r: '{}:{}'.format(r['chr'], r['start']),
            axis=1)
        df['significance'] = df.apply(
            lambda r:
            '{} ({})'.format(r['significance'], r['reason'])
            if r['significance'] else None,
            axis=1)

        df = df.rename(columns={
            'gene': 'Gene',
            'position': 'Position',
            'change': 'Change',
            'amino_acid_change': 'AA change',
            'cdna_change': 'cDNA change',
            'type': 'Effect',
            'significance': 'Significance',
            'allelefreq': 'Freq',
            'dkfzbias_summary': 'Damage bias',
            'incidentalome_list': 'Callability issues'
        })

        # Add links to SolveBio
        records = df.to_dict('records')
        return (
            html.Div(id='dataset-link', children=[
                # TODO: filter with sample and vardict2mut
                html.A('Dataset: {}'.format(dataset.full_path),
                        href='https://my.solvebio.com/data/{}'
                        .format(dataset_id),
                        target='_blank')
            ], style={'margin-bottom': '10px'}),
            sdc.DashReactTable(id='react-table', data=json.dumps(records), columns=json.dumps(COLUMNS)),
            html.A('Export to CSV',
                   id='download-link',
                   download="alterations.csv",
                   href=""),
            html.Div(id='selected-indexes'),
            dcc.Graph(id='graph-1'))


# @app.callback(
#     Output('dataset-table', 'selected_row_indices'),
#     [Input('graph-1', 'clickData')],
#     [State('dataset-table', 'selected_row_indices')])
# def update_selected_row_indices(clickData, selected_row_indices):
#     if clickData:
#         for point in clickData['points']:
#             if point['pointNumber'] in selected_row_indices:
#                 selected_row_indices.remove(point['pointNumber'])
#             else:
#                 selected_row_indices.append(point['pointNumber'])
#     return selected_row_indices


# @app.callback(
#     Output('graph-1', 'figure'),
#     [Input('dataset-table', 'rows'),
#      Input('dataset-table', 'selected_row_indices')])
# def update_figure(rows, selected_row_indices):
#     df = pd.DataFrame(rows)

#     marker = {}
#     colormap = {
#         'stop_gained': '#00800',
#         'missense_variant': '#00CCCC',
#         'frameshift_variant': '#800080',
#         'start_lost': '#FFA500',
#         'splice_region_variant': '#FF0000',
#         'disruptive_inframe_insertion': '#CCCC00',
#     }
#     marker['color'] = df.apply(
#         lambda r: colormap.get(r['Effect'], '#0074D9'), axis=1)

#     for i in (selected_row_indices or []):
#         marker['color'][i] = '#FF851B'

#     hover_text = df.apply(
#         lambda r: '<br>'.join([
#             '<b>{}</b> - {}% AF'.format(r['Gene'], r['Freq']),
#             '{}'.format(r['AA change']),
#             '{}'.format(r['Effect'])
#         ]), axis=1)

#     # Variants by AF
#     trace1 = go.Bar(
#         y=df['Freq'],
#         marker=marker,
#         hoverinfo='text',
#         text=hover_text
#         # title='Variants by AF'
#     )

#     # Nucleotide change histogram
#     nc_df = df[df.var_type == 'SNV']
#     trace2 = go.Histogram(
#         x=nc_df['nuc_change'].sort_values(),
#         histnorm='percent',
#         hoverinfo='none',
#         xaxis='x2',
#         yaxis='y2'
#     )

#     data = [trace1, trace2]
#     layout = go.Layout(
#         xaxis1=dict(
#             title='Row in table',
#         ),
#         yaxis1=dict(
#             title='Allele Frequency',
#             range=[0, 100]
#         ),
#         xaxis2=dict(
#             domain=[0.7, 1],
#             anchor='y2',
#             linecolor='black',
#             linewidth=1,
#             mirror=True
#         ),
#         yaxis2=dict(
#             domain=[0.6, 1],
#             anchor='x2',
#             title='Percentage',
#             linecolor='black',
#             linewidth=1,
#             mirror=True
#         ),
#         showlegend=False,
#         height=500
#     )

#     return go.Figure(data=data, layout=layout)


# @app.callback(
#     Output('download-link', 'href'),
#     [Input('dataset-table', 'rows')])
# def update_download_link(rows):
#     try:
#         from urllib.parse import quote as urlquote
#     except ImportError:
#         from urllib import quote as urlquote

#     df = pd.DataFrame(rows)
#     csv_string = df.to_csv(index=False, encoding='utf-8')
#     csv_string = "data:text/csv;charset=utf-8," + urlquote(csv_string)

#     return csv_string


app.css.append_css(
    {"external_url": "https://codepen.io/davidhpark/pen/OZzxZp.css"})

if __name__ == '__main__':
    app.run_server(debug=True)
