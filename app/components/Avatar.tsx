import * as React from 'react';

const Avatar = ({ name, avatarUrl, size }: { name: string; avatarUrl: string | undefined; size: number }) => {
    if (avatarUrl === '') avatarUrl = undefined;
    return (
        <img
            className="rounded-circle mx-auto"
            alt={name}
            src={avatarUrl}
            height={size}
            width={size}
            style={{ border: 'var(--bs-secondary) 1px solid' }}
        />
    );
};

export default Avatar;
