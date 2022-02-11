import { format } from 'date-fns';

export const formatDate = (
    date: Date | string | undefined,
    isDetail = false
): string => {
    const dateObj = date ? new Date(date) : new Date();

    if (isDetail) {
        return format(dateObj, "MMMM do yyyy 'at' h:mm a");
    }

    let dateFormat = 'MM/dd/yyyy';
    let formattedDate;

    if (dateObj.getDate() === new Date().getDate()) {
        dateFormat = 'h:mm a';
    }

    if (dateObj.getDate() === new Date().getDate() - 1) {
        formattedDate = 'Yesterday';
    } else {
        formattedDate = format(dateObj, dateFormat);
    }

    return formattedDate;
};

export const renderDescriptionFirstLine = (description: string) => {
    if (description.includes('\n')) {
        return description.split('\n')[0];
    }

    return description;
};

export const findNote = (notes, noteId) => {
    return notes.find((note) => {
        return note._id === noteId;
    });
};

export const decodeHtml = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
};
