import * as React from 'react';
import { IdeHeader } from '~/XesCodingIDE/layout/IdeHeader';
import { useRefState } from '~/XesCodingIDE/utils';
import type { PublishWorkInfo } from '@/interfaces/work';
import '../styles/ide.css';
import { CircularProgress, Divider } from '@mui/material';
import ProjectPublishModal from '~/XesCodingIDE/components/ProjectPublishModal';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { AceEditor, Terminal } from '~/XesCodingIDE';
import { getTemplate } from '../utils';
import AutoCloseAlert from '@/components/AutoCloseAlert';
import type { BasicResponse } from '@/interfaces/common';

const typeToLangMap = {
    cpp: 'cpp',
};

const typeToVersionMap = {
    cpp: 'cpp',
};

const typeToAceMap = {
    cpp: 'c_cpp',
};

const typeToWorkIdMap = {
    cpp: '1',
};

interface WebIDEProps {
    workId: string;
    userId: string;
    type: 'cpp';
    className?: string;
}

export function WebIDE(props: WebIDEProps) {
    const workName = useRefState('新作品');
    const workInfo = useRefState<PublishWorkInfo | undefined>(undefined);
    const code = useRefState('');

    const isLoading = useRefState(true);
    const isSaving = useRefState(false);
    const isShowPublishModal = useRefState(false);
    const xtermFitContent = useRefState<() => void>(() => () => {});
    const alerts = useRefState<React.ReactNode[]>([]);

    const onClickRefreshTemplate = async () => {
        if (window.confirm('确定要刷新模板吗？当前未保存的更改将会丢失！')) {
            isLoading.set(true);
            try {
                // @ts-ignore
                const template = await getTemplate(typeToLangMap[props.type]);
                code.set(template);
                alerts.set(prev => [
                    <AutoCloseAlert severity="info" closeTimeout={5000} key={Date.now()}>
                        模板已刷新
                    </AutoCloseAlert>,
                    ...prev.slice(0, 2),
                ]);
            } catch (error) {
                alerts.set(prev => [
                    <AutoCloseAlert severity="error" closeTimeout={5000} key={Date.now()}>
                        刷新失败，请重试
                    </AutoCloseAlert>,
                    ...prev.slice(0, 2),
                ]);
            } finally {
                isLoading.set(false);
            }
        }
    };

    const onClickSave = async () => {
        isSaving.set(true);
        try {
            const response = await fetch(`/api/compilers/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: workName,
                    xml: code,
                    id: props.workId === typeToWorkIdMap[props.type] ? null : Number(props.workId),
                    lang: typeToLangMap[props.type],
                    type: '',
                    version: typeToAceMap[props.type],
                    user_id: props.workId === typeToWorkIdMap[props.type] ? 8510061 : Number(props.userId),
                    code_complete: typeToWorkIdMap[props.type],
                    original_id: typeToWorkIdMap[props.type],
                    planid: null,
                    problemid: null,
                    projectid: props.workId === typeToWorkIdMap[props.type] ? null : Number(props.workId),
                    removed: 0,
                    assets: {
                        assets: [],
                        cdns: ['https://static0.xesimg.com', 'https://livefile.xesimg.com'],
                        cursorsMap: {},
                        hide_filelist: false,
                    },
                }),
            });
            const responseData: BasicResponse<PublishWorkInfo> = await response.json();

            if (response.ok) {
                alerts.set(prev => [
                    <AutoCloseAlert severity="success" closeTimeout={5000} key={Date.now()}>
                        保存成功！
                    </AutoCloseAlert>,
                    ...prev.slice(0, 2),
                ]);
            } else {
                alerts.set(prev => [
                    <AutoCloseAlert severity="error" closeTimeout={5000} key={Date.now()}>
                        保存失败，请重试
                    </AutoCloseAlert>,
                    ...prev.slice(0, 2),
                ]);
            }

            return responseData.data;
        } catch (error) {
            alerts.set(prev => [
                <AutoCloseAlert severity="error" closeTimeout={5000} key={Date.now()}>
                    保存失败，请重试
                </AutoCloseAlert>,
                ...prev.slice(0, 2),
            ]);
            return null;
        } finally {
            isSaving.set(false);
        }
    };

    React.useEffect(() => {
        let ignore = false;

        const loadProject = async () => {
            isLoading.set(true);
            try {
                if (props.workId && props.workId !== typeToWorkIdMap[props.type]) {
                    const response = await fetch(`/api/compilers/v2/${props.workId}?id=${props.workId}`);
                    const responseData: BasicResponse<PublishWorkInfo> = await response.json();
                    if (!ignore) {
                        code.set(responseData.data.xml);
                        workName.set(responseData.data.name);
                        workInfo.set(responseData.data);
                    }
                } else {
                    const template = await getTemplate('cpp');
                    if (!ignore) {
                        code.set(template);
                    }
                }
            } catch (error) {
                alerts.set(prev => [
                    <AutoCloseAlert severity="error" closeTimeout={5000} key={Date.now()}>
                        加载失败，请刷新页面重试
                    </AutoCloseAlert>,
                    ...prev.slice(0, 2),
                ]);
            } finally {
                if (!ignore) {
                    isLoading.set(false);
                }
            }
        };

        loadProject();
        return () => {
            ignore = true;
        };
    }, [props.workId]);

    return (
        <div className={'flex flex-col max-h-[100vh] ' + props.className}>
            <div className="alert-list">{alerts.current}</div>

            <IdeHeader
                workName={workName}
                isSaving={isSaving.current}
                isLoading={isLoading.current}
                onClickRefreshTemplate={onClickRefreshTemplate}
                onClickSave={async () => {
                    const data = await onClickSave();
                    if (data && String(data.id) !== props.workId) {
                        location.href = `/ide/${props.type}/${data.id}`;
                    }
                }}
                onClickPublish={async () => {
                    if (props.workId === '1') {
                        const data = await onClickSave();
                        if (data) {
                            location.href = `/ide/cpp/${data.id}`;
                        }
                    } else {
                        const data = await onClickSave();
                        if (data) {
                            workInfo.set(data);
                            isShowPublishModal.set(true);
                        }
                    }
                }}
            />

            <Divider className="my-2" />

            {isLoading.current ? (
                <>
                    <div className="flex-1" />
                    <div className="mx-auto flex gap-2 items-center">
                        <CircularProgress color="primary" />
                        <span style={{ fontSize: 24 }}>Loading...</span>
                    </div>
                    <div className="flex-1" />
                </>
            ) : (
                <div className="flex flex-1">
                    <PanelGroup
                        direction="horizontal"
                        className="flex-1 overflow-hidden bg-neutral-100"
                        onLayout={() => {
                            console.log(xtermFitContent.current);
                            xtermFitContent.current();
                        }}
                    >
                        <Panel className="flex flex-col" defaultSize={60} minSize={20} maxSize={80}>
                            <div className="flex-1 p-2">
                                <AceEditor
                                    value={code.current}
                                    mode="c_cpp"
                                    theme="textmate"
                                    onChange={code.set}
                                    fontSize={16}
                                    tabSize={4}
                                    className="w-full h-full"
                                />
                            </div>
                        </Panel>
                        <PanelResizeHandle className="custom-resize-handle">
                            <div className="resize-lines">
                                <div />
                                <div />
                                <div />
                            </div>
                        </PanelResizeHandle>
                        <Panel className="flex" defaultSize={40} minSize={20} maxSize={80}>
                            <Terminal code={code.current} lang="cpp" className="flex-1" toFitDOM={xtermFitContent} />
                        </Panel>
                    </PanelGroup>
                </div>
            )}

            {props.workId !== '1' && workInfo.current && (
                <ProjectPublishModal
                    isShow={isShowPublishModal.current}
                    setIsShow={isShowPublishModal.set}
                    workInfo={workInfo.current}
                />
            )}
        </div>
    );
}
