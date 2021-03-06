// @flow
import * as React from 'react';
import Papa from 'papaparse';
import { autoBindMethodsForReact } from 'class-autobind-decorator';
import { AUTOBIND_CFG } from '../../../common/constants';

type Props = {
  body: Buffer,
};

type State = {
  result: null | { data: Array<Array<string>> },
};

@autoBindMethodsForReact(AUTOBIND_CFG)
class ResponseCSVViewer extends React.PureComponent<Props, State> {
  currentHash: string;

  constructor(props: Props) {
    super(props);
    this.state = {
      result: null,
    };
    this.currentHash = '';
  }

  update(body: Buffer) {
    const csv = body.toString('utf8');

    Papa.parse(csv, {
      skipEmptyLines: true,
      complete: result => {
        this.setState({ result });
      },
    });
  }

  componentDidMount() {
    this.update(this.props.body);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillUpdate(nextProps: Props, nextState: State) {
    if (this.props.body === nextProps.body) {
      return;
    }

    this.update(nextProps.body);
  }

  render() {
    const { result } = this.state;
    if (!result) {
      return 'Parsing CSV...';
    }

    return (
      <div className="pad-sm">
        <table className="table--fancy table--striped table--compact selectable">
          <tbody>
            {result.data.map(row => (
              <tr>
                {row.map(c => (
                  <td>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ResponseCSVViewer;
