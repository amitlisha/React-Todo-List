import React, { FunctionComponent } from "react";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { Filter } from "../../../../enums/Filter";

interface Props {
  filterTodos: string;
  onChange: (event: React.MouseEvent<HTMLElement>, newFilter: string) => void;
}

const FilterTodos: FunctionComponent<Props> = ({ filterTodos, onChange }) => {
  return (
    <ToggleButtonGroup
      size="small"
      exclusive
      value={filterTodos}
      onChange={onChange}
    >
      <ToggleButton value={Filter.ALL}>All</ToggleButton>
      <ToggleButton value={Filter.ACTIVE}>Active</ToggleButton>
      <ToggleButton value={Filter.COMPLETED}>Completed</ToggleButton>
    </ToggleButtonGroup>
  );
};

export default FilterTodos;
