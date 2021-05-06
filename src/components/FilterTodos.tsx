import React, { FunctionComponent } from "react";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { FilterState } from "../enums/FilterState";

interface IProps {
  filterTodos: string;
  onChange: (event: React.MouseEvent<HTMLElement>, newFilter: string) => void;
}

const FilterTodos: FunctionComponent<IProps> = ({ filterTodos, onChange }) => {
  return (
    <ToggleButtonGroup
      size="small"
      exclusive
      value={filterTodos}
      onChange={onChange}
    >
      <ToggleButton value={FilterState.ALL}>All</ToggleButton>
      <ToggleButton value={FilterState.ACTIVE}>Active</ToggleButton>
      <ToggleButton value={FilterState.COMPLETED}>Completed</ToggleButton>
    </ToggleButtonGroup>
  );
};

export default FilterTodos;
