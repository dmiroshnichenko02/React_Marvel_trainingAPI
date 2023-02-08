import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelServices';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './comicsList.scss';

const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case "waiting":
            return <Spinner />;
            break;
        case "loading":
            return newItemLoading ? <Component/> : <Spinner />;
            break;
        case "confirmed":
            return <Component/>;
            break;
        case "error":
            return <ErrorMessage />;
            break;
        default:
            throw new Error('Unexpected process state');
    }
}

const ComicsList = () => {

    const [comics, setComics] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const { loading, error, getAllComics, process, setProcess } = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        getAllComics(offset)
            .then(onComicsLoad)
            .then(() => setProcess('confirmed'))
    }

    const onComicsLoad = (newData) => {
        let ended = false
        if (newData.length < 8) {
            ended = true
        }
        setComics(comics => [...comics, ...newData]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 8)
        setComicsEnded(comicsEnded => ended)
    }

    function renderItem(arr) {
        const items = arr.map((item, i) => {
            return (
                <li
                    className="comics__item"
                    tabIndex={0}
                    key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img" />
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{`${item.price}`}</div>
                    </Link>
                </li>
            )
        })
        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    // const item = renderItem(comics);

    // const errorMessage = error ? <ErrorMessage /> : null;
    // const spinner = loading && !newItemLoading ? <Spinner /> : null;

    return (
        <div className="comics__list">
            {/* {errorMessage}
            {spinner}
            {item} */}
            {setContent(process, ()=> renderItem(comics), newItemLoading)}
            <button className="button button__main button__long"
                disabled={newItemLoading}
                style={{ 'display': comicsEnded ? 'none' : 'block' }}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;