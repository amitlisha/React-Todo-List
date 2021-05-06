import CardActions from "@material-ui/core/CardActions";
import Grid from "@material-ui/core/Grid";
import React, { FunctionComponent } from "react";
import FilterTodos from "./FilterTodos";
import ClearCompleted from "./ClearCompleted";

interface IProps {
  filterTodos: string;
  numberOfUncompletedTodos: number;
  handleFilterChange: (
    event: React.MouseEvent<HTMLElement>,
    newFilter: string
  ) => void;
  clearAllCompleted: () => void;
}

const CardFooter: FunctionComponent<IProps> = ({
  filterTodos,
  numberOfUncompletedTodos,
  handleFilterChange,
  clearAllCompleted,
}) => {
  return (
    <CardActions>
      <Grid container alignItems="center">
        <Grid item xs={4}>
          {numberOfUncompletedTodos} items left
        </Grid>
        <Grid item xs={4}>
          <FilterTodos
            filterTodos={filterTodos}
            onChange={handleFilterChange}
          ></FilterTodos>
        </Grid>
        <Grid item xs={4}>
          <ClearCompleted onClear={clearAllCompleted}></ClearCompleted>
        </Grid>
      </Grid>
    </CardActions>
  );
};

export default CardFooter;
