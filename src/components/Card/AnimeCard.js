import React, { useState } from 'react';
import { SeasonEnum } from '../../utils/enum'
import { IsAdmin } from '../../utils/userDetail';
import EditAnimePopup from '../../components/Popup/EditAnimePopup';
import { SaveAnime } from '../../utils/firebase';
import AnilistApi from '../../api/anilist';
import AnimeInfoPopup from '../Popup/AnimeInfoPopup';

const AnimeCard = props => {
    const anime = props.anime;
    const [editPopup, setEditPopup] = useState(false)
    const [infoPopup, setInfoPopup] = useState(false)
    const [animeInfo, setAnimeInfo] = useState(null)
    const increase = field => {
        let animeCopy = JSON.parse(JSON.stringify(anime));
        animeCopy[field] = parseInt(animeCopy[field]) + 1;
        SaveAnime(anime.key, animeCopy);
    }
    const showInfoPopup = async () => {
        const response = await AnilistApi.getAnime(anime.title, anime.blacklist);
        setAnimeInfo(response);
        setInfoPopup(true);
    }
    return (
        <div className="anime-card col-12 col-sm-6 col-md-6 col-lg-4 p-3">
            <div className="card">
                <div className="card-img-top " style={{ background: 'url(' + anime.cover_url + ') center / cover', height: '360px' }}>
                    <small className="position-absolute align-middle px-1 pb-0 pt-0 text-white rounded" style={{ top: '5px', left: '5px', background: 'rgba(0,0,0,0.5)' }}>
                        <i className="material-icons" style={{ color: 'yellow', fontSize: '9px' }} >star</i>
                        <b> {anime.score}</b>
                    </small>
                    <div className="position-absolute" style={{ top: '20px', right: '20px' }}>
                        <button className="btn btn-outline-light border-0 p-0 m-0" style={{ height: '24px' }}>
                            <i className="material-icons">share</i>
                        </button>
                        {IsAdmin() &&
                            <button id='btn-edit' className="btn btn-outline-light border-0 p-0 m-0 ml-3" style={{ height: '24px' }} onClick={() => setEditPopup(true)}>
                                <i className="material-icons">edit</i>
                            </button>
                        }
                    </div>
                </div>
                <div className="card-header position-absolute w-100 text-left p-2 h-auto pr-5"
                    style={{ background: 'rgba(0,0,0,0.5)', bottom: 'calc(100% - 360px)' }}>
                    <p className="mb-0 mx-0 p-0 text-white text-left">{anime.title}</p>
                    <p className="mb-0" style={{ marginTop: '-5px', minHeight: '5px' }}>
                        <small className="text-white-50">{anime.genres}</small>
                    </p>
                    <div className="position-absolute" style={{ top: 'calc(50% - 12px)', right: '10px' }}>
                        <button className="btn btn-outline-light border-0 p-0 m-0" style={{ height: '24px' }} id="btn-show-info" onClick={showInfoPopup}>
                            <i className="material-icons">info_outline</i>
                        </button>
                    </div>
                </div>
                <div className="card-body p-0">
                    <table className="table m-0 table-borderless table-sm table-hover">
                        <tbody className="text-muted">
                            <tr>
                                <td className="text-left px-3"><small>Studio</small></td>
                                <td className="text-right px-3"><small>{anime.studio}</small></td>
                            </tr>
                            <tr>
                                <td className="text-left px-3"><small>Season</small></td>
                                <td className="text-right px-3"><small>{anime.year} {SeasonEnum[anime.season.toString()]}</small></td>
                            </tr>
                            {IsAdmin() &&
                                <tr>
                                    <td className="text-left px-3"><small>View</small></td>
                                    <td className="text-right px-3">
                                        <small>{anime.view}/{anime.download}</small>
                                        {anime.view.toString() !== anime.download.toString() &&
                                            <b id='btn-add-view' className="text-primary" style={{ cursor: 'pointer' }} onClick={() => increase('view')}>+</b>
                                        }
                                    </td>
                                </tr>
                            }
                            <tr>
                                <td className="text-left px-3"><small>Download</small></td>
                                <td className="text-right px-3">
                                    <small>{anime.download}/{anime.all_episode}</small>
                                    {IsAdmin() && anime.download.toString() !== anime.all_episode.toString() &&
                                        <b id='btn-add-download' className="text-primary" style={{ cursor: 'pointer' }} onClick={() => increase('download')}>+</b>
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="card-footer p-1">
                    <div className="d-flex justify-content-around w-auto">

                        {!anime.gdriveid_public && <a id='btn-gdrive' className="btn btn-outline-secondary disabled h-auto border-0" type="button" href={'http://doc.google.com/drive/folders/' + anime.gdriveid_public} target='blank'>
                            <i className="material-icons align-middle">folder</i>
                        </a>}
                        {anime.gdriveid_public && <a id='btn-gdrive' className="btn btn-outline-light h-auto border-0" role="button" href={'http://doc.google.com/drive/folders/' + anime.gdriveid_public} target='blank'>
                            <i className="material-icons align-middle">folder</i>
                        </a>}

                        {anime.url === '' && <a id='btn-gphoto' className="btn btn-outline-secondary disabled h-auto border-0" type="button" href={anime.url} target='blank'>
                            <i className="material-icons align-middle">photo_library</i>
                        </a>}
                        {anime.url !== '' && <a id='btn-gphoto' className="btn btn-outline-light h-auto border-0" role="button" href={anime.url} target='blank'>
                            <i className="material-icons align-middle">photo_library</i>
                        </a>}

                        {IsAdmin() && anime.download_url === '' && <a id='btn-download' className="btn btn-outline-secondary disabled h-auto border-0" type="button" href={anime.download_url} target='blank'>
                            <i className="material-icons align-middle">add_box</i>
                        </a>}
                        {IsAdmin() && anime.download_url !== '' && <a id='btn-download' className="btn btn-outline-light h-auto border-0" role="button" href={anime.download_url} target='blank'>
                            <i className="material-icons align-middle">add_box</i>
                        </a>}
                    </div>
                </div>
            </div>
            <EditAnimePopup anime={anime} show={editPopup} setShow={setEditPopup} />
            <AnimeInfoPopup anime={anime} info={animeInfo} show={infoPopup} setShow={setInfoPopup} />
        </div >
    );
}

export default AnimeCard;