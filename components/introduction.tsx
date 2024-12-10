import { useMemo } from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import styled from "styled-components";

const DATE_OF_BIRTH = dayjs("1998-07-28");

const Progress = styled(motion.progress)`
  margin-bottom: 1em;
  width: 100%;
`;

const Card = styled.div`
  display: block;
  background: white;
  border-radius: 0.3rem;
  width: 20rem;
`;

const CardContent = styled.div`
  display: block;
  padding: 0.7rem;
`;

type CardMediaProps = {
  image: string;
};

const CardMedia = styled.div<CardMediaProps>`
  display: block;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 0.3rem 0.3rem 0 0;
  background-image: url(${({ image }) => image});
  height: 20rem;
`;

const Me = () => {
  const age = useMemo(() => dayjs().diff(DATE_OF_BIRTH, "years", true), []);

  return (
    <Card>
      <CardMedia image="https://avatars1.githubusercontent.com/u/6902134" />
      <CardContent>
        <h2>Gabriel Pérez</h2>
        <h5>{age | 0} years old</h5>
        <div>
          <Progress value={(age % 1) * 100} max={100} />
        </div>
        <p>
          A programmer orem ipsum dolor sit amet, consetetur sadipscing elitr,
          sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
          aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
          dolores et ea rebum.
        </p>
      </CardContent>
    </Card>
  );
};

export default Me;
