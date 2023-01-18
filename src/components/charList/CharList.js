import { Component } from 'react';

import './charList.scss';

import MarvelService from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

class CharList extends Component {
    state = {
        data: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 1540,
        charEnded: false,
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharactersLoad)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({ newItemLoading: true })
    }

    onCharactersLoad = (newData) => {
        let ended = false
        if(newData.length < 9) {
            ended = true
        }

        this.setState(({ data, offset }) => ({
            data: [...data, ...newData],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended,
        }))
    }

    onError = () => {
        this.setState({ error: true, loading: false })
    }

    renderItem = (arr) => {
        const items = arr.map(item => {
            let imgStyle = { 'objectFit': 'cover' };
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit': 'unset' };
            }
            return (
                <li className="char__item" key={item.id}
                    onClick={() => this.props.onCharSelected(item.id)}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                    <div className="char__name">{item.name}</div>
                </li>
            )
        })
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {
        const { data, loading, error, offset, newItemLoading, charEnded} = this.state;
        const items = this.renderItem(data);

        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;