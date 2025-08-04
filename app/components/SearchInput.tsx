import * as React from 'react';
import { TextField, Box } from '@mui/material';
import type { Associate_words } from '@/interfaces/common';
import '@/styles/search.scss';

const SearchInput = ({ keyword = '' }: { keyword?: string }) => {
    const timerRef = React.useRef<NodeJS.Timeout>(null);
    const [keyword_input, setKeywordInput] = React.useState<string>(keyword);
    const [is_show_suggestions, setIsShowSuggestions] = React.useState<boolean>(false);
    const [suggestions, setSuggestions] = React.useState<React.JSX.Element[]>([]);

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
        >
            <TextField
                onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
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
                                            setKeywordInput(word.replace(/<em>/g, '').replace(/<\/em>/g, ''));
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
                }}
                onBlur={() => {
                    setTimeout(() => {
                        if (is_show_suggestions) {
                            setIsShowSuggestions(false);
                            // @ts-ignore  // TODO: fix this type error
                            clearTimeout(timerRef.current);
                        }
                    }, 100);
                }}
                type="search"
                label="搜索"
                className="mr-sm-2"
                name="keyword"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setKeywordInput(event.target.value);
                }}
                defaultValue={keyword || ''}
                variant="outlined"
                fullWidth
            />
            <ul id="suggestions-list" style={{ display: is_show_suggestions ? 'block' : 'none', zIndex: 9999 }}>
                {suggestions}
            </ul>
        </Box>
    );
};

export default SearchInput;
