import * as React from 'react';
import { Box, styled, alpha, Autocomplete, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { Associate_words } from '@/interfaces/common';
import '@/styles/search.css';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        width: 'auto',
    },
}));

const SearchInput = ({ keyword = '' }: { keyword?: string }) => {
    const [options, setOptions] = React.useState<string[]>([]);
    const [inputValue, setInputValue] = React.useState(keyword);

    const fetchSuggestions = React.useCallback(async (value: string) => {
        if (!value) {
            setOptions([]);
            return;
        }
        const response = await fetch(`/api/search/associate_words?keyword=${value}`);
        const responseData: Associate_words = await response.json();
        setOptions(responseData.data.map(item => decodeURIComponent(item.word.replace(/<em>/g, '').replace(/<\/em>/g, ''))));
    }, []);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            fetchSuggestions(inputValue.toLowerCase());
        }, 400);
        return () => clearTimeout(timer);
    }, [inputValue, fetchSuggestions]);

    return (
        <Box
            component="form"
            role="search"
            action="/search"
            onSubmit={event => {
                event.preventDefault();
                window.location.href = `/search?keyword=${inputValue}`;
            }}
            style={{ display: 'flex', alignItems: 'center' }}
        >
            <Search>
                <Autocomplete
                    freeSolo
                    options={options}
                    inputValue={inputValue}
                    onInputChange={(_, value) => setInputValue(value)}
                    onChange={(_, value) => {
                        if (typeof value === 'string') setInputValue(value);
                    }}
                    sx={{ width: '100%' }}
                    renderInput={params => (
                        <TextField
                            {...params}
                            fullWidth
                            placeholder="搜索..."
                            variant="outlined"
                            size="small"
                            sx={{ 
                                minWidth: 240,
                                '& .MuiInputBase-root': { margin: 0 },
                            }}
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                                sx: {
                                    borderRadius: 2,
                                    background: 'rgba(255,255,255,0.8)',
                                    height: 40,
                                },
                            }}
                        />
                    )}
                />
            </Search>
        </Box>
    );
};

export default SearchInput;
