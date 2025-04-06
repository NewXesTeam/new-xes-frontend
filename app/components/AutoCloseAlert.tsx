import * as React from 'react';
import { Alert } from 'react-bootstrap';

import type { Variant } from 'react-bootstrap/esm/types';

const AutoCloseAlert = ({
    variant,
    dismissible = true,
    closeTimeout = 1000,
    children,
}: {
    variant: Variant;
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
        <Alert show={show} variant={variant} dismissible={dismissible} onClose={() => setShow(false)}>
            {children}
        </Alert>
    );
};

export default AutoCloseAlert;
