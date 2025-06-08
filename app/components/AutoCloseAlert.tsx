import * as React from 'react';
import { Alert, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import type { AlertProps } from '@mui/material/Alert';

const AutoCloseAlert = ({
    severity,
    dismissible = true,
    closeTimeout = 1000,
    children,
}: {
    severity: AlertProps['severity'];
    dismissible?: boolean;
    closeTimeout?: number;
    children: React.ReactNode;
}) => {
    const [show, setShow] = React.useState(false);
    const [ending, setEnding] = React.useState(false);

    React.useEffect(() => {
        setShow(true);

        const timer = setTimeout(() => {
            setShow(false);
            setTimeout(() => {
                setEnding(true);
            }, 1000);
        }, closeTimeout);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    if (ending) {
        return null;
    }

    return (
        <Collapse in={show}>
            <Alert
                severity={severity}
                action={
                    dismissible && (
                        <IconButton aria-label="close" color="inherit" size="small" onClick={() => setShow(false)}>
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    )
                }
                onClose={() => setShow(false)}
            >
                {children}
            </Alert>
        </Collapse>
    );
};

export default AutoCloseAlert;
