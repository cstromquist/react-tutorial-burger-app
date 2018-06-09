import React from 'react';

import classes from './Order.css';

const order = (props) => (
	<div className={classes.Order}>
		<p>Ingredients: Salad (1)</p>
		<p>Total Price: $5.25</p>
	</div>
);

export default order;