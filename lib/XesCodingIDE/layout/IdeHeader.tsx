import * as React from 'react';
import { Box, Button, TextField, Paper, Stack, CircularProgress, IconButton } from '@mui/material';
import { Save, Publish, Refresh } from '@mui/icons-material';
import type { RefState } from '../utils';

interface IdeHeaderProps {
    className?: string;
    workName: RefState<string>;
    isSaving: boolean;
    isLoading: boolean;
    onClickRefreshTemplate: () => void;
    onClickSave: () => void;
    onClickPublish: () => void;
}

export function IdeHeader(props: IdeHeaderProps) {
    return (
        <div className={'flex justify-between px-4 py-2 ' + props.className}>
            <div className="flex items-center gap-2">
                <span>XesCoding</span>
                <TextField
                    id="work-name"
                    label="作品名称"
                    variant="outlined"
                    value={props.workName.current}
                    size="small"
                    onChange={e => props.workName.set(e.target.value)}
                />

                <IconButton
                    size="small"
                    color="default"
                    onClick={props.onClickRefreshTemplate}
                    disabled={props.isLoading}
                    sx={{
                        display: { xs: 'none', sm: 'flex' },
                        '&:hover': {
                            bgcolor: '#f1f5f9',
                        },
                    }}
                    title="刷新模板"
                >
                    <Refresh fontSize="small" />
                </IconButton>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={
                        props.isSaving ? <CircularProgress size={16} color="inherit" /> : <Save fontSize="small" />
                    }
                    disabled={props.isSaving || props.isLoading}
                    onClick={props.onClickSave}
                >
                    保存
                </Button>

                <Button
                    variant="contained"
                    color="success"
                    size="small"
                    startIcon={<Publish fontSize="small" />}
                    onClick={props.onClickPublish}
                    disabled={props.isSaving || props.isLoading}
                    sx={{
                        borderRadius: 1.5,
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                    }}
                >
                    发布
                </Button>
            </div>
        </div>
    );
}
