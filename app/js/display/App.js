import Globals from 'Globals';
import React from 'react';

class App extends React.Component
{
  constructor(props)
  {
    super(props);
  }
  render()
  {
    return (
      <div className='App'>
        <img src='/images/react.png'/>
        <p>React from Angular Boilerplate Success</p>
      </div>
    );
  }
}

export default App;