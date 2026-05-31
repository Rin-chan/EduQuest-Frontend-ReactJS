import * as React from 'react';
import { useDrag, useDrop } from "react-dnd";
import Box from "@mui/material/Box";

const BadgeList = {
    "badge1": "/assets/first_attempt_badge.svg",
    "badge2": "/assets/full_attendance_badge.svg",
}

interface DragItem {
  index: number;
};

export function DraggableBadge({
  badge,
  index,
  moveBadge,
}: {
  badge: string;
  index: number;
  moveBadge: (dragIndex: number, hoverIndex: number) => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "BADGE",
    item: { index },

    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop<DragItem>(() => ({
    accept: "BADGE",

    hover(item) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveBadge(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  }));

  drag(drop(ref));

  return (
    <Box
      ref={ref}
      sx={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        p: 1,
        border: "1px solid #ccc",
        borderRadius: 1,
        mb: 1,
        bgcolor: "background.paper",
      }}
    >
        <Box 
            component="img"
            src={BadgeList[badge as keyof typeof BadgeList]}
            sx={{
                width: 64,
                height: 64,
            }}
        />
    </Box>
  );
}