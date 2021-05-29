import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import NextIcon from '@material-ui/icons/NavigateNext';
import BackIcon from '@material-ui/icons/NavigateBefore';
import {AppBar} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import {drawerWidth} from "../Navbar/Navbar";
import Paper from "@material-ui/core/Paper";
import {useDispatch, useSelector} from "react-redux";
import {Action, Selector} from "../../utils/Store/AppStore";
import {FilterOption, Season} from "../../models/Constants";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Card from "@material-ui/core/Card";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";

export default function FilterBar({seasonList}) {
    const classes = useStyles();
    const dispatch = useDispatch();
    let filter = useSelector(Selector.getFilter);
    const [expanded, setExpand] = useState(false);
    const currentSeason =
        filter.category.toString() === FilterOption.ONLY_UNSEEN.toString() ||
        filter.category.toString() === FilterOption.ONLY_UNFINISH.toString()
            ? FilterOption.ALL_SEASON
            : filter?.season === FilterOption.LATEST_SEASON
            ? Object.keys(seasonList).sort().pop() || FilterOption.ALL_SEASON
            : filter.season;
    const noNextSeason =
        Object.keys(seasonList).sort().pop() === currentSeason ||
        currentSeason.toString() === FilterOption.ALL_SEASON.toString()
    const noPreviousSeason =
        Object.keys(seasonList).sort().reverse().pop() === currentSeason ||
        currentSeason.toString() === FilterOption.ALL_SEASON.toString()
    const seasonToText = (season: string | number): string => {
        if (season.toString() === FilterOption.ALL_SEASON.toString())
            return 'All Season';
        const [year, seasonNum] = season.toString().split(',');
        return year.toString() + ' ' + (Season[seasonNum] as string);
    };
    const goToNextSeason = (): void => {
        if (noNextSeason) return;
        const nextSeasonIndex =
            Object.keys(seasonList)
                .sort()
                .findIndex((season) => season === currentSeason) + 1;
        const nextSeason = Object.keys(seasonList).sort()[nextSeasonIndex];
        dispatch(Action.applyFilter({...filter, season: nextSeason}));
    };

    const goToPreviousSeason = (): void => {
        if (noPreviousSeason) return;
        const previousSeasonIndex =
            Object.keys(seasonList)
                .sort()
                .findIndex((season) => season === currentSeason) - 1;
        const previousSeason = Object.keys(seasonList).sort()[previousSeasonIndex];
        dispatch(Action.applyFilter({...filter, season: previousSeason}));
    };

    return (
        <>
            <div className={classes.toolbar}/>
            <AppBar position="fixed" className={classes.appBar}>
                <Paper className={classes.toggleButton}>
                    <Button onClick={goToNextSeason} disabled={noNextSeason}><BackIcon/></Button>
                    <Button onClick={() => setExpand(!expanded)}>{seasonToText(currentSeason)}</Button>
                    <Button onClick={goToPreviousSeason} disabled={noPreviousSeason}><NextIcon/></Button>
                </Paper>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Toolbar className={classes.toolBar}>
                        <FormControl className={classes.formControl}>
                            <Select
                                value={filter.category}
                                onChange={(e) => dispatch(Action.applyFilter({...filter, category: e.target.value}))}
                            >
                                <MenuItem value={FilterOption.ALL_ANIME}>All Anime</MenuItem>
                                <MenuItem value={FilterOption.ONLY_UNSEEN}>Unfinished</MenuItem>
                                <MenuItem value={FilterOption.ONLY_UNFINISH}>Incomplete</MenuItem>
                                <MenuItem value={FilterOption.ONLY_FINISH}>Complete</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <Select
                                value={currentSeason}
                                onChange={(e) => dispatch(Action.applyFilter({...filter, season: e.target.value}))}
                            >
                                <MenuItem value={FilterOption.ALL_SEASON}>All Anime</MenuItem>
                                {Object.keys(seasonList)
                                    .sort()
                                    .reverse()
                                    .map((season) => (
                                        <MenuItem key={season} value={season}>{season.split(',')[0]}{' '}
                                            {Season[season.split(',')[1]]} (
                                            {seasonList[season]})</MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <Select
                                value={filter.orderBy}
                                onChange={(e) => dispatch(Action.applyFilter({...filter, orderBy: e.target.value}))}
                            >
                                <MenuItem value={FilterOption.SORT_BY_SEASON}>Sort by Season</MenuItem>
                                <MenuItem value={FilterOption.SORT_BY_SCORE}>Sort by Score</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <TextField defaultValue={filter.keyword} placeholder={"Search..."} onBlur={(e) => dispatch(Action.applyFilter({...filter, keyword: e.target.value}))}/>
                        </FormControl>
                    </Toolbar>
                </Collapse>
            </AppBar>
        </>
    );
}

const useStyles = makeStyles((theme) => ({
    appBar: {
        top: 'auto',
        bottom: 0,
        backgroundColor: theme.palette.secondary.dark,
        [theme.breakpoints.up('md')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
    },
    grow: {
        flexGrow: 1,
    },
    toggleButton: {
        position: 'absolute',
        zIndex: 1,
        top: -50,
        left: 0,
        right: 0,
        margin: '0 auto',
        width: 250,
        display: 'flex',
        justifyContent: 'space-between',
        alignItem: 'center',
        backgroundColor: theme.palette.secondary.dark,
    },
    toolBar: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItem: 'center',
        [theme.breakpoints.up('sm')]: {
            flexDirection: 'row',
        },
    },
    formControl: {
        width: '95%',
        margin: 4,
        [theme.breakpoints.up('sm')]: {
            width: '24%',
            maxWidth: 180
        },
    },
    toolbar: theme.mixins.toolbar,
}));
