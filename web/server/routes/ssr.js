import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import reducers from '../../client/src/reducers/index';
import App from '../../client/src/app';
const path = require('path');

const router = express.Router();

router.get('*', (req, res) => {
  /*
    http://redux.js.org/docs/recipes/ServerRendering.html
  */
  const store = createStore(reducers);

  store.dispatch({ type: 'ASSIGN_ADDRESS', address: process.env.ADDRESS });

  const context = {};

  const html = ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter
        location={req.originalUrl}
        context={context}
      >
        <App onServer/>
      </StaticRouter>
    </Provider>,
  );

  const finalState = store.getState();

  if (context.url) {
    res.writeHead(301, {
      Location: context.url,
    });
    res.end();
  } else {
    res.status(200).render('../views/index.ejs', {
      html,
      script: JSON.stringify(finalState),
    });
  }
});

export default router;
