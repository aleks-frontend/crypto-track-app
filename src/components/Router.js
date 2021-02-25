import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CurrencyTable from './currency-table/CurrencyTable';
import Details from './details/Details';

const Router = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={CurrencyTable} />
            <Route path="/currency/:currencyId" component={Details} />
        </Switch>
    </BrowserRouter>
)

export default Router;
