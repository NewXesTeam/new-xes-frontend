import * as React from 'react';
import { Form } from 'react-bootstrap';
import { Associate_words } from '@/interfaces/common';
import '@/styles/search.scss';

const SearchInput = ({ keyword = null }: { keyword?: string }) => {
    const timerRef = React.useRef<NodeJS.Timeout>(null);
    const [is_show_suggestions, setIsShowSuggestions] = React.useState<boolean>(false);
    const [suggestions, setSuggestions] = React.useState<React.JSX.Element[]>([]);

    return (
        <Form role="search" action="/search.html" className="me-2">
            <Form.Control
                onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
                    clearTimeout(timerRef.current);
                    timerRef.current = setTimeout(async () => {
                        const inputValue = event.target.value.toLowerCase();
                        setSuggestions([]);
                        let suggestionsList: string[] = [];

                        if (inputValue.length > 0) {
                            const response = await fetch(`/api/search/associate_words?keyword=${inputValue}`);
                            const responseData: Associate_words = await response.json();
                            for (let i = 0; i < responseData.data.length; ++i) {
                                suggestionsList.push(unescape(responseData.data[i].word));
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
                }}
                onBlur={() => {
                    setTimeout(() => {
                        if (is_show_suggestions === true) {
                            setIsShowSuggestions(false);
                            clearTimeout(timerRef.current);
                        }
                    }, 100);
                }}
                type="search"
                placeholder="搜索"
                className="mr-sm-2"
                name="keyword"
                defaultValue={keyword || ''}
            />
            <ul id="suggestions-list" style={{ display: is_show_suggestions ? 'block' : 'none', zIndex: 9999 }}>
                {suggestions}
            </ul>
        </Form>
    );
};

export default SearchInput;
