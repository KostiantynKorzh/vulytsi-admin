import React from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Typography
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const Tags = ({tags, setTags}) => {
    return (
        <div style={{
            marginTop: "40px"
        }}>{tags &&
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}><Typography>Tags</Typography></AccordionSummary>
                <AccordionDetails>
                    <FormGroup>
                        {Object.entries(tags).map(([ key, value ]) => (
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
                </AccordionDetails>
            </Accordion>
        }
        </div>
    );
};

export default Tags;