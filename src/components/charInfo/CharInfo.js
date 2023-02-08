import { useState, useEffect } from 'react';

import PropTypes from 'prop-types'

import useMarvelService from '../../services/MarvelServices';
import setContent from '../../utils/setContent';

import './charInfo.scss';


const CharInfo = (props) => {

    const [char, setChar] = useState(null)

    const {getCharacter, clearError, process, setProcess } = useMarvelService();


    useEffect(() => {
        updateChar();
        if (props.charId !== props.charId) {
            updateChar();
        }
    }, [props.charId])



    const updateChar = () => {
        const { charId } = props
        if (!charId) {
            return;
        }
            clearError();
        getCharacter(charId)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onCharLoaded = (chars) => {
        setChar(char => chars)
    }



    // const skeleton = char || loading || error ? null : <Skeleton />
    // const errorMessages = error ? <ErrorMessages /> : null;
    // const spinner = loading ? <Spinner /> : null;
    // const content = !(loading || error || !char) ? <View char={char} /> : null


    return (
        <div className="char__info">
            {/* {skeleton}
            {errorMessages}
            {spinner}
            {content} */}
            {setContent(process, View, char)}
        </div>
    )
}

const View = ({ data }) => {
    const { name, description, thumbnail, homepage, wiki, comics } = data
    let imgStyle = { 'objectFit': 'cover' };
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = { 'objectFit': 'unset' };
    }
    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'There is no comics with this character'}
                {
                    comics.map((item, i) => {
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })
                }

            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number

}

export default CharInfo;