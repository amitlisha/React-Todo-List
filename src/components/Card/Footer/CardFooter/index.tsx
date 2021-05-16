import CardActions from "@material-ui/core/CardActions";
import Grid from "@material-ui/core/Grid";
import React, { FunctionComponent } from "react";
import FilterTodos from "../FilterTodos";
import ClearCompletedButton from "../ClearCompletedButton";
import Card from "@material-ui/core/Card";
interface Props {
  todosFilter: string;
  numberOfUncompletedTodos: number;
  handleFilterChange: (
    event: React.MouseEvent<HTMLElement>,
    newFilter: string
  ) => void;
  clearAllCompleted: () => void;
}

const CardFooter: FunctionComponent<Props> = ({
  todosFilter,
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
            todosFilter={todosFilter}
            onChange={handleFilterChange}
          />
        </Grid>
        <Grid item xs={4}>
          {/* QUESTION: */}
          {/* ClearCompletedButton will be rerendered every time todos array is changed, because onClear useCallback has to have todos in his deps array */}
          {/* so is it worth it to use React.memo here? I'm not really sure */}
          <ClearCompletedButton onClear={clearAllCompleted} />
        </Grid>
      </Grid>
    </CardActions>
  );
};

export default React.memo(CardFooter);
