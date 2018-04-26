/*eslint-disable */
import React from 'react';
import { Widgets, Operators } from '../packages/react-awesome-query-builder';
const {
  TextWidget,
  NumberWidget,
  SelectWidget,
  MultiSelectWidget,
  DateWidget,
  BooleanWidget,
  TimeWidget,
  DateTimeWidget,
  ValueFieldWidget
} = Widgets;
const { ProximityOperator } = Operators;
import moment from 'moment';
import en_US from 'antd/lib/locale-provider/en_US';
import ru_RU from 'antd/lib/locale-provider/ru_RU';

export default {
  conjunctions: {
    AND: {
      label: 'And',
      formatConj: (children, conj, isForDisplay) => {
        return children.size > 1 ?
          '(' + children.join(' ' + (isForDisplay ? 'AND' : '&&') + ' ') + ')'
          : children.first();
      }
    },
    OR: {
      label: 'Or',
      formatConj: (children, conj, isForDisplay) => {
        return children.size > 1 ?
          '(' + children.join(' ' + (isForDisplay ? 'OR' : '||') + ' ') + ')'
          : children.first();
      }
    }
  },
  types: {
    text: {
      widgets: {
        text: {
          defaultOperator: 'contains',
          operators: [
            'exactly_equals',
            'is_none',
            'contains',
            'prefix',
            'regex',
            'select_any_in',
            'is'
          ],
          widgetProps: {
            formatValue: (val, fieldDef, wgtDef, isForDisplay) => ('_' + JSON.stringify(val)),
            valueLabel: 'Text',
            valuePlaceholder: 'Enter text'
          }
        },
      }
    },
    number: {
      valueSources: ['value'],
      widgets: {
        number: {
          operators: [
            'equal',
            'not_equal',
            'less',
            'less_or_equal',
            'greater',
            'greater_or_equal',
            'between',
            'not_between',
            'is_empty',
            'is_not_empty'
          ],
          defaultOperator: 'less',
          widgetProps: {
            valueLabel: 'Number2',
            valuePlaceholder: 'Enter number2'
          }
        }
      }
    },
    date: {
      widgets: {
        date: {
          operators: [
            'equal',
            'not_equal',
            'less',
            'less_or_equal',
            'greater',
            'greater_or_equal',
            'between',
            'not_between',
            'is_empty',
            'is_not_empty'
          ]
        }
      }
    },
    time: {
      widgets: {
        time: {
          operators: [
            'equal',
            'not_equal',
            'less',
            'less_or_equal',
            'greater',
            'greater_or_equal',
            'between',
            'not_between',
            'is_empty',
            'is_not_empty'
          ]
        }
      }
    },
    datetime: {
      widgets: {
        datetime: {
          operators: [
            'equal',
            'not_equal',
            'less',
            'less_or_equal',
            'greater',
            'greater_or_equal',
            'between',
            'not_between',
            'is_empty',
            'is_not_empty'
          ],
          opProps: {
            between: {
              valueLabels: [
                { label: 'Date from', placeholder: 'Enrer datetime from' },
                { label: 'Date to', placeholder: 'Enter datetime to' }
              ]
            }
          },
          widgetProps: {
            timeFormat: 'HH:mm',
            dateFormat: 'YYYY-MM-DD',
            valueFormat: 'YYYY-MM-DD HH:mm'
          }
        }
      }
    },
    select: {
      mainWidget: 'select',
      widgets: {
        select: {
          operators: [
            'select_equals',
            'select_not_equals'
          ],
          widgetProps: {
            customProps: {
              showSearch: true
            }
          }
        },
        multiselect: {
          operators: [
            'select_any_in',
            'select_not_any_in'
          ],
          widgetProps: {
          }
        }
      }
    },
    boolean: {
      widgets: {
        boolean: {
          operators: [
            'is'
          ],
          widgetProps: {
            hideOperator: true,
            // operatorInlineLabel: "is",
          }
        }
      }
    }
  },
  operators: {
    prefix: {
      label: 'prefix',
      labelForFormat: 'PREFIX'
    },
    regex: {
      label: 'regex',
      labelForFormat: 'REGEX'
    },
    contains: {
      label: 'contains',
      labelForFormat: 'CONTAINS'
    },
    is: {
      label: 'is',
      labelForFormat: 'IS'
    },
    is_none: {
      isUnary: true,
      label: 'is none',
      labelForFormat: 'IS NONE',
      cardinality: 0
    },
    exactly_equals: {
      label: 'exactly equals',
      labelForFormat: 'EXACTLY EQUALS'
    },
    equal: {
      label: '==',
      labelForFormat: '==',
      reversedOp: 'not_equal'
    },
    not_equal: {
      label: '!=',
      labelForFormat: '!=',
      reversedOp: 'equal'
    },
    less: {
      label: '<',
      labelForFormat: '<',
      reversedOp: 'greater_or_equal'
    },
    less_or_equal: {
      label: '<=',
      labelForFormat: '<=',
      reversedOp: 'greater'
    },
    greater: {
      label: '>',
      labelForFormat: '>',
      reversedOp: 'less_or_equal'
    },
    greater_or_equal: {
      label: '>=',
      labelForFormat: '>=',
      reversedOp: 'less'
    },

    between: {
      label: 'Between',
      labelForFormat: 'BETWEEN',
      cardinality: 2,
      formatOp: (field, op, values, valueSrcs, valueTypes, opDef, operatorOptions, isForDisplay) => {
        let valFrom = values.first();
        let valTo = values.get(1);
        if (isForDisplay)
          return `${field} >= ${valFrom} AND ${field} <= ${valTo}`;
        else
          return `${field} >= ${valFrom} && ${field} <= ${valTo}`;
      },
      valueLabels: [
        'Value from',
        'Value to'
      ],
      textSeparators: [
        null,
        'and'
      ],
      reversedOp: 'not_between'
    },
    not_between: {
      label: 'Not between',
      labelForFormat: 'NOT BETWEEN',
      cardinality: 2,
      reversedOp: 'between',
      valueLabels: [
        'Value from',
        'Value to'
      ],
      textSeparators: [
        null,
        'and'
      ],
      reversedOp: 'between'
    },

    is_empty: {
      isUnary: true,
      label: 'Is Empty',
      labelForFormat: 'IS EMPTY',
      cardinality: 0,
      reversedOp: 'is_not_empty',
      formatOp: (field, op, value, valueSrc, valueType, opDef, operatorOptions, isForDisplay) => {
        return isForDisplay ? `${field} IS EMPTY` : `!${field}`;
      }
    },
    is_not_empty: {
      isUnary: true,
      label: 'Is not empty',
      labelForFormat: 'IS NOT EMPTY',
      cardinality: 0,
      reversedOp: 'is_empty',
      formatOp: (field, op, value, valueSrc, valueType, opDef, operatorOptions, isForDisplay) => {
        return isForDisplay ? `${field} IS NOT EMPTY` : `!!${field}`;
      }
    },
    select_equals: {
      label: '==',
      labelForFormat: '==',
      formatOp: (field, op, value, valueSrc, valueType, opDef, operatorOptions, isForDisplay) => {
        return `${field} == ${value}`;
      },
      reversedOp: 'select_not_equals'
    },
    select_not_equals: {
      label: '!=',
      labelForFormat: '!=',
      formatOp: (field, op, value, valueSrc, valueType, opDef, operatorOptions, isForDisplay) => {
        return `${field} != ${value}`;
      },
      reversedOp: 'select_equals'
    },
    select_any_in: {
      label: 'in',
      labelForFormat: 'IN',
      formatOp: (field, op, values, valueSrc, valueType, opDef, operatorOptions, isForDisplay) => {
        if (valueSrc == 'value')
          return `${field} IN (${values.join(', ')})`;
        else
          return `${field} IN (${values})`;
      },
      reversedOp: 'select_not_any_in'
    },
    select_not_any_in: {
      label: 'Not in',
      labelForFormat: 'NOT IN',
      formatOp: (field, op, values, valueSrc, valueType, opDef, operatorOptions, isForDisplay) => {
        if (valueSrc == 'value')
          return `${field} NOT IN (${values.join(', ')})`;
        else
          return `${field} NOT IN (${values})`;
      },
      reversedOp: 'select_any_in'
    },
    multiselect_equals: {
      label: 'Equals',
      labelForFormat: '==',
      formatOp: (field, op, values, valueSrc, valueType, opDef, operatorOptions, isForDisplay) => {
        if (valueSrc == 'value')
          return `${field} == [${values.join(', ')}]`;
        else
          return `${field} == ${values}`;
      },
      reversedOp: 'multiselect_not_equals'
    },
    multiselect_not_equals: {
      label: 'Not equals',
      labelForFormat: '!=',
      formatOp: (field, op, values, valueSrc, valueType, opDef, operatorOptions, isForDisplay) => {
        if (valueSrc == 'value')
          return `${field} != [${values.join(', ')}]`;
        else
          return `${field} != ${values}`;
      },
      reversedOp: 'multiselect_equals'
    },

    proximity: {
      label: 'Proximity search',
      cardinality: 2,
      valueLabels: [
        { label: 'Word 1', placeholder: 'Enter first word' },
        'Word 2'
      ],
      textSeparators: [
        //'Word 1',
        //'Word 2'
      ],
      formatOp: (field, op, values, valueSrc, valueType, opDef, operatorOptions, isForDisplay) => {
        let val1 = values.first();
        let val2 = values.get(1);
        return `${field} ${val1} NEAR/${operatorOptions.get('proximity')} ${val2}`;
      },
      options: {
        optionLabel: 'Near',
        optionTextBefore: 'Near',
        optionPlaceholder: 'Select words between',
        factory: (props) => <ProximityOperator {...props} />,
        defaults: {
          proximity: 2
        }
      }
    }
  },
  widgets: {
    text: {
      type: 'text',
      valueSrc: 'value',
      factory: (props) => <TextWidget {...props} />,
      formatValue: (val, fieldDef, wgtDef, isForDisplay) => {
        return isForDisplay ? '"' + val + '"' : JSON.stringify(val);
      },
      validateValue: (val, fieldDef) => {
        return (val != 'test');
      }
    },
    number: {
      type: 'number',
      valueSrc: 'value',
      factory: (props) => <NumberWidget {...props} />,
      valueLabel: 'Number',
      valuePlaceholder: 'Enter number',
      formatValue: (val, fieldDef, wgtDef, isForDisplay) => {
        return isForDisplay ? val : JSON.stringify(val);
      }
    },
    select: {
      type: 'select',
      valueSrc: 'value',
      factory: (props) => <SelectWidget {...props} />,
      formatValue: (val, fieldDef, wgtDef, isForDisplay) => {
        let valLabel = fieldDef.listValues[val];
        return isForDisplay ? '"' + valLabel + '"' : JSON.stringify(val);
      }
    },
    multiselect: {
      type: 'multiselect',
      valueSrc: 'value',
      factory: (props) => <MultiSelectWidget {...props} />,
      formatValue: (vals, fieldDef, wgtDef, isForDisplay) => {
        let valsLabels = vals.map(v => fieldDef.listValues[v]);
        return isForDisplay ? valsLabels.map(v => '"' + v + '"') : vals.map(v => JSON.stringify(v));
      }
    },
    date: {
      type: 'date',
      valueSrc: 'value',
      factory: (props) => <DateWidget {...props} />,
      dateFormat: 'DD.MM.YYYY',
      valueFormat: 'YYYY-MM-DD',
      formatValue: (val, fieldDef, wgtDef, isForDisplay) => {
        let dateVal = moment(val, wgtDef.valueFormat);
        return isForDisplay ? '"' + dateVal.format(wgtDef.dateFormat) + '"' : JSON.stringify(val);
      }
    },
    time: {
      type: 'time',
      valueSrc: 'value',
      factory: (props) => <TimeWidget {...props} />,
      timeFormat: 'HH:mm',
      valueFormat: 'HH:mm:ss',
      formatValue: (val, fieldDef, wgtDef, isForDisplay) => {
        let dateVal = moment(val, wgtDef.valueFormat);
        return isForDisplay ? '"' + dateVal.format(wgtDef.timeFormat) + '"' : JSON.stringify(val);
      }
    },
    datetime: {
      type: 'datetime',
      valueSrc: 'value',
      factory: (props) => <DateTimeWidget {...props} />,
      timeFormat: 'HH:mm',
      dateFormat: 'DD.MM.YYYY',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      formatValue: (val, fieldDef, wgtDef, isForDisplay) => {
        let dateVal = moment(val, wgtDef.valueFormat);
        return isForDisplay ? '"' + dateVal.format(wgtDef.dateFormat + ' ' + wgtDef.timeFormat) + '"' : JSON.stringify(val);
      }
    },
    boolean: {
      type: 'boolean',
      valueSrc: 'value',
      factory: (props) => <BooleanWidget {...props} />,
      labelYes: 'True',
      labelNo: 'False',
      formatValue: (val, fieldDef, wgtDef, isForDisplay) => {
        return isForDisplay ? (val ? 'Yes' : 'No') : JSON.stringify(!!val);
      },
      defaultValue: false
    },
    field: {
      valueSrc: 'field',
      factory: (props) => <ValueFieldWidget {...props} />,
      formatValue: (val, fieldDef, wgtDef, isForDisplay, valFieldDef) => {
        return isForDisplay ? (valFieldDef.label || val) : val;
      },
      valueLabel: 'Field to compare',
      valuePlaceholder: 'Select field to compare',
      customProps: {
        showSearch: true
      }
    }
  },
  settings: {
    locale: {
      short: 'en',
      full: 'en-US',
      antd: en_US
    },
    maxLabelsLength: 50,
    hideConjForOne: true,
    renderSize: 'small',
    renderConjsAsRadios: false,
    renderFieldAndOpAsDropdown: false,
    customFieldSelectProps: {
      showSearch: true
    },
    groupActionsPosition: 'topRight', // oneOf [topLeft, topCenter, topRight, bottomLeft, bottomCenter, bottomRight]
    setOpOnChangeField: ['keep', 'default'], // 'default' (default if present), 'keep' (keep prev from last field), 'first', 'none'
    clearValueOnChangeField: false, //false - if prev & next fields have same type (widget), keep
    clearValueOnChangeOp: false,
    setDefaultFieldAndOp: false,
    maxNesting: 10,
    fieldSeparator: '.',
    fieldSeparatorDisplay: '->',
    showLabels: false,
    valueLabel: 'Value',
    valuePlaceholder: 'Value',
    fieldLabel: 'Field',
    operatorLabel: 'Operator',
    fieldPlaceholder: 'Select field',
    operatorPlaceholder: 'Select operator',
    deleteLabel: null,
    addGroupLabel: 'Add group',
    addRuleLabel: 'Add rule',
    delGroupLabel: null,
    canLeaveEmptyGroup: true, //after deletion
    formatReverse: (q, operator, reversedOp, operatorDefinition, revOperatorDefinition, isForDisplay) => {
      if (isForDisplay)
        return 'NOT(' + q + ')';
      else
        return '!(' + q + ')';
    },
    formatField: (field, parts, label2, fieldDefinition, config, isForDisplay) => {
      if (isForDisplay)
        return label2;
      else
        return field;
    },
    valueSourcesInfo: {
      value: {
        label: 'Value'
      },
      field: {
        label: 'Field',
        widget: 'field'
      }
    },
    valueSourcesPopupTitle: 'Select value source',
    canReorder: true,
    canCompareFieldWithField: (leftField, leftFieldConfig, rightField, rightFieldConfig) => {
      //for type == 'select'/'multiselect' you can check listValues
      return true;
    }
  }
};
/*eslint-disable */