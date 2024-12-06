import ReactDOM from 'react-dom';
import VotingApp from './App';
import { Provider } from 'react-redux';
import store from './redux/store/store';

ReactDOM.render(
	<Provider store={store}>
		<VotingApp />
	</Provider>,
	document.getElementById('app')
);