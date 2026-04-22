import { useState, useCallback } from 'react';

interface ModalState {
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

export const useResponseModal = () => {
    const [modal, setModal] = useState<ModalState>({
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
    });

    const showModal = useCallback(
        (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
            setModal({
                isOpen: true,
                title,
                message,
                type,
            });
        },
        []
    );

    const closeModal = useCallback(() => {
        setModal((prev) => ({
            ...prev,
            isOpen: false,
        }));
    }, []);

    return { modal, showModal, closeModal };
};
