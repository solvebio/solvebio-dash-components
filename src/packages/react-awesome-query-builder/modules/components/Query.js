import React, { Component } from 'react';
import PropTypes from 'prop-types';
import createTreeStore from '../stores/tree';
import {createStore} from 'redux';
import {Provider, Connector, connect} from 'react-redux';
import * as actions from '../actions';
import {extendConfig} from "../utils/configUtils";
import {bindActionCreators} from "../utils/stuff";
import {validateTree} from "../utils/validation";
import { LocaleProvider } from 'antd';
import Immutable from 'immutable';


class ConnectedQuery extends Component {
    static propTypes = {
        config: PropTypes.object.isRequired,
        onChange: PropTypes.func,
        get_children: PropTypes.func,
        tree: PropTypes.instanceOf(Immutable.Map),
        //dispatch: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.validatedTree = this.validateTree(props, props.config, props.tree);
        if (props.tree !== this.validatedTree) {
            props.onChange && props.onChange(this.validatedTree);
        }
    }

    validateTree (props, oldConfig, oldTree) {
        return validateTree(props.tree, oldTree, props.config, oldConfig, true, true);
    }

    componentWillReceiveProps(nextProps) {
        const {tree, onChange} = nextProps;
        const oldTree = this.props.tree;
        const oldConfig = this.props.config;
        const newTree = nextProps.tree;
        const oldValidatedTree = this.validatedTree;
        this.validatedTree = this.validateTree(nextProps, oldConfig, oldTree);
        let validatedTreeChanged = oldValidatedTree !== this.validatedTree 
            && JSON.stringify(oldValidatedTree) != JSON.stringify(this.validatedTree);
        if (validatedTreeChanged) {
            onChange && onChange(this.validatedTree);
            this.setState({treeChanged: true})
        } else {
            this.setState({treeChanged: false})
        }
    }

    render() {
        const {config, tree, get_children, dispatch, ...props} = this.props;
        const validatedTree = this.validatedTree;
        return <div>
            {get_children({
                tree: this.validatedTree,
                actions: bindActionCreators({...actions.tree, ...actions.group, ...actions.rule}, config, dispatch),
                config: config,
                dispatch: dispatch
            })}
        </div>
    }
}

const QueryContainer = connect(
    (tree) => {
        return {tree: tree}
    },
)(ConnectedQuery);


export default class Query extends Component {
    static propTypes = {
        //config
        conjunctions: PropTypes.object.isRequired,
        fields: PropTypes.object.isRequired,
        types: PropTypes.object.isRequired,
        operators: PropTypes.object.isRequired,
        widgets: PropTypes.object.isRequired,
        settings: PropTypes.object.isRequired,

        onChange: PropTypes.func,
        get_children: PropTypes.func,
        value: PropTypes.instanceOf(Immutable.Map),
    };

    constructor(props, context) {
        super(props, context);
        const config = {
            conjunctions: props.conjunctions,
            fields: props.fields,
            types: props.types,
            operators: props.operators,
            widgets: props.widgets,
            settings: props.settings,
            tree: props.value,
        };

        const tree = createTreeStore(config);

        this.state = {
            store: createStore(tree)
        };
    }

    // handle case when value property changes
    componentWillReceiveProps(nextProps) {
      var tree = nextProps.value;
      var oldTree = this.props.tree;
      if (tree !== oldTree) {
        //TODO: This causes infinite loop! Dispatch in updating lifecycle methods is evil!
        //this.state.store.dispatch(
        //  actions.tree.setTree(this.props.config, tree)
        //)
      }
    }

    render() {
        const {conjunctions, fields, types, operators, widgets, settings, get_children, onChange, value, tree, children, ...props} = this.props;
        let config = {conjunctions, fields, types, operators, widgets, settings};
        config = extendConfig(config);

        return (
            <LocaleProvider locale={config.settings.locale.antd}>
                <Provider store={this.state.store}>
                    <QueryContainer
                      store={this.state.store}
                      get_children={get_children}
                      config={config}
                      onChange={onChange}
                    />
                </Provider>
            </LocaleProvider>
        )
    }
}
