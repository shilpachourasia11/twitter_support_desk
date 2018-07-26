import React from 'react';

class App extends React.Component {

  render() {
    return(
        <div className="routerView">
          {this.props.children}
        </div>
    );
  }
}

export default App;
