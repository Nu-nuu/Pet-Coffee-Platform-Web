import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export function FilterGraphComponent(props) {
    const label = props.label;
    const name = props.name;
    const month = props.month;
    const handleMonthChange = props.handleMonthChange;
    const xLabels = props.xLabels;

    return (
        <FormControl style={{ width: "20%", marginBlock: "20px" }}>
            <InputLabel id={name} color="secondary">
                {label}
            </InputLabel>
            <Select
                id={name}
                name={name}
                value={month}
                label={label}
                onChange={handleMonthChange}
                color="secondary"
                defaultValue={month}
            >
                {xLabels.map((label, index) => (
                    <MenuItem value={label} key={index}>
                        {label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
