import React from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import Index from '@/pages/index';
import SaleNameCard from '@/pages/saleNameCard';

class BasicRoute extends React.Component {
    render() {
    return (
        <Router>
              <Route path='/'  component={Index} />
              <Route path='/saleNameCard/:userPin' component={SaleNameCard} />
        </Router>
    )
  }
}

export default BasicRoute;
