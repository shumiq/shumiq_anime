import React from 'react';
import { SeasonEnum } from '../../utils/enum'

const AnimeCard = props => {
    const anime = props.anime;
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
                        <button className="btn btn-outline-light border-0 p-0 m-0 ml-3" style={{ height: '24px' }}>
                            <i className="material-icons">edit</i>
                        </button>
                    </div>
                </div>
                <div className="card-header position-absolute w-100 text-left p-2 h-auto pr-5"
                    style={{ background: 'rgba(0,0,0,0.5)', bottom: 'calc(100% - 360px)' }}>
                    <p className="mb-0 mx-0 p-0 text-white text-left">{anime.title}</p>
                    <p className="mb-0" style={{ marginTop: '-5px', minHeight: '5px' }}>
                        <small className="text-white-50">{anime.genres}</small>
                    </p>
                    <div className="position-absolute" style={{ top: 'calc(50% - 12px)', right: '10px' }}>
                        <button className="btn btn-outline-light border-0 p-0 m-0" style={{ height: '24px' }}>
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
                            <tr className="adminonly">
                                <td className="text-left px-3"><small>View</small></td>
                                <td className="text-right px-3">
                                    <small>{anime.view}/{anime.download}</small>
                                    {anime.view.toString() !== anime.download.toString() &&
                                        <b className="text-primary" style={{ cursor: 'pointer' }}>+</b>
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td className="text-left px-3"><small>Download</small></td>
                                <td className="text-right px-3">
                                    <small>{anime.download}/{anime.all_episode}</small>
                                    {anime.download.toString() !== anime.all_episode.toString() &&
                                        <b className="text-primary" style={{ cursor: 'pointer' }}>+</b>
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="card-footer p-1">
                    <div className="d-flex justify-content-around w-auto">
                        <button className="btn btn-outline-secondary disabled h-auto border-0" type="button">
                            <i className="material-icons align-middle">folder</i>
                        </button>

                        {anime.url === '' && <a className="btn btn-outline-secondary disabled h-auto border-0" type="button" href={anime.url} target='blank'>
                            <i className="material-icons align-middle">open_in_browser</i>
                        </a>}
                        {anime.url !== '' && <a className="btn btn-outline-light h-auto border-0" role="button" href={anime.url} target='blank'>
                            <i className="material-icons align-middle">open_in_browser</i>
                        </a>}

                        {anime.download_url === '' && <a className="btn btn-outline-secondary disabled h-auto border-0" type="button" href={anime.download_url} target='blank'>
                            <i className="material-icons align-middle">library_add</i>
                        </a>}
                        {anime.download_url !== '' && <a className="btn btn-outline-light h-auto border-0" role="button" href={anime.download_url} target='blank'>
                            <i className="material-icons align-middle">library_add</i>
                        </a>}
                    </div>
                </div>
            </div>
        </div >
    );
}

export default AnimeCard;