import * as React from 'react';
import { TextField, Box, styled, InputBase, alpha } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { Associate_words } from '@/interfaces/common';
import '@/styles/search.scss';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

const SearchInput = ({ keyword = '' }: { keyword?: string }) => {
    const timerRef = React.useRef<NodeJS.Timeout>(null);
    const [keyword_input, setKeywordInput] = React.useState<string>(keyword);
    const [is_show_suggestions, setIsShowSuggestions] = React.useState<boolean>(false);
    const [suggestions, setSuggestions] = React.useState<React.JSX.Element[]>([]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore  // TODO: fix this type error
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(async () => {
            const inputValue = event.target.value.toLowerCase();
            setSuggestions([]);

            let suggestionsList: string[] = [];

            if (inputValue.length > 0) {
                const response = await fetch(`/api/search/associate_words?keyword=${inputValue}`);
                const responseData: Associate_words = await response.json();
                for (let i = 0; i < responseData.data.length; ++i) {
                    suggestionsList.push(decodeURIComponent(responseData.data[i].word));
                }
                setSuggestions(
                    suggestionsList.map((word, index) => (
                        <li
                            key={index}
                            onClick={() => {
                                event.target.value = word.replace(/<em>/g, '').replace(/<\/em>/g, '');
                                setIsShowSuggestions(false);
                            }}
                            ref={element => {
                                if (element) {
                                    element.innerHTML = word;
                                }
                            }}
                        />
                    )),
                );
                setIsShowSuggestions(true);
            } else {
                setIsShowSuggestions(false);
            }
        }, 500);
    }

    return (
        <Box
            component="form"
            role="search"
            action="/search"
            className="me-2"
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                window.location.href = `/search?keyword=${keyword_input}`;
            }}
            style={{ display: 'flex', alignItems: 'center' }}
        >
            <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder="搜索..."
                    inputProps={{ 'aria-label': 'search', type: 'search', name: 'keyword', defaultValue: keyword_input }}
                    onInput={handleInputChange}
                    onBlur={() => {
                        setTimeout(() => {
                            if (is_show_suggestions) {
                                setIsShowSuggestions(false);
                                // @ts-ignore  // TODO: fix this type error
                                clearTimeout(timerRef.current);
                            }
                        }, 100);
                    }}
                />
            </Search>
            <ul id="suggestions-list" style={{ display: is_show_suggestions ? 'block' : 'none', zIndex: 9999 }}>
                {suggestions}
            </ul>
        </Box>
    );
};

export default SearchInput;
