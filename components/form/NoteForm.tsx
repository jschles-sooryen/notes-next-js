import * as React from 'react';
import { Box, styled } from '@mui/material';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import Cancel from '@mui/icons-material/Cancel';
import { useForm, Controller } from 'react-hook-form';
import Card from '../ui/Card';
import BasicButton from '../ui/BasicButton';

const NoteDescriptionTextArea = styled((props: TextFieldProps) => (
    <TextField {...props} multiline fullWidth />
))({
    height: '100%',
    '& .MuiOutlinedInput-root': {
        height: '100%',
        display: 'block',
    },
});

interface Props {
    onSubmit(data): void;
    onCancel?(): void;
    name?: string;
    description?: string;
    isUpdating?: boolean;
}

const NoteForm: React.FC<Props> = ({
    onSubmit,
    name,
    description,
    isUpdating = false,
    onCancel,
}) => {
    const { control, handleSubmit, formState } = useForm({
        defaultValues: {
            name: name || '',
            description: description || '',
        },
    });

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'start',
                    justifyContent: 'space-between',
                }}
            >
                <Box sx={{ width: '50%' }}>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field: { onChange, value, name, ref } }) => (
                            <TextField
                                fullWidth
                                required
                                name={name}
                                value={value}
                                onChange={onChange}
                                inputRef={ref}
                                label="Note Title"
                                error={!!formState?.errors?.name}
                                helperText={formState?.errors?.name?.message}
                            />
                        )}
                        rules={{ required: 'Note Title is required.' }}
                    />
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    {isUpdating ? (
                        <BasicButton
                            onClick={onCancel}
                            startIcon={<Cancel />}
                            sx={{
                                paddingY: '16.5px',
                                paddingX: 3,
                                marginRight: 2,
                            }}
                        >
                            Cancel
                        </BasicButton>
                    ) : null}
                    <BasicButton
                        onClick={handleSubmit(onSubmit)}
                        startIcon={<ArrowUpward />}
                        sx={{
                            paddingY: '16.5px',
                            paddingX: 3,
                        }}
                    >
                        Submit
                    </BasicButton>
                </Box>
            </Box>

            <Box sx={{ marginTop: 2, height: '100%' }}>
                <Controller
                    name="description"
                    control={control}
                    render={({ field: { onChange, value, name, ref } }) => (
                        <NoteDescriptionTextArea
                            required
                            name={name}
                            value={value}
                            inputRef={ref}
                            onChange={onChange}
                            label="Note Description"
                            error={!!formState?.errors?.description}
                            helperText={formState?.errors?.description?.message}
                        />
                    )}
                    rules={{ required: 'Note Description is required.' }}
                />
            </Box>
        </Card>
    );
};

export default NoteForm;
