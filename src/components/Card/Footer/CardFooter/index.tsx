import CardActions from "@material-ui/core/CardActions";
import Grid from "@material-ui/core/Grid";
import React, { FunctionComponent } from "react";
import FilterTodos from "../FilterTodos";
import ClearCompleted from "../ClearCompleted";
import Card from "@material-ui/core/Card";
interface IProps {
  // TODO: name is misleading, rename to indicate it's real purpose
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
      <Grid container alignItems="stretch" justify="space-around">
        <Grid item xs={4}>
          <Card
            style={{
              margin: "auto 5%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            variant="outlined"
          >
            {numberOfUncompletedTodos} ITEMS LEFT
          </Card>
        </Grid>
        <Grid item xs={4}>
          <FilterTodos
            filterTodos={filterTodos}
            onChange={handleFilterChange}
          />
        </Grid>
        <Grid item xs={4}>
          <ClearCompleted onClear={clearAllCompleted} />
        </Grid>
      </Grid>
    </CardActions>
  );
};

export default CardFooter;
