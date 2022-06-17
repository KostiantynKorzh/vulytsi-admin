import React from 'react';
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

export const Tags = ({tags, setTags}) => {
    return (
        <>
            <h1>Теги</h1>
            <FormGroup>
                {tags && Object.entries(tags).map(([ key, value ]) => (
                    <FormControlLabel control={<Checkbox
                        checked={value}
                        onChange={(e) => {
                            setTags({
                                ...tags,
                                [key]: e.target.checked
                            })
                        }}
                    />} label={key}/>
                ))
                }
            < /FormGroup>
        </>
    );
};

export default Tags;