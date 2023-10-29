import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import dummyData from "../dummyData";
import Card from './Card';

const Main = () => {
  const [data, setData] = useState(dummyData);

  const onDragEnd = (result) => {
    console.log(result);
    const {source, destination} = result;

    //別のカラムにタスクが移動した時
    if (source.droppableId !== destination.droppableId ) {
      const sourceColIndex = data.findIndex((e) => e.id === source.droppableId);
      const destinationColIndex = data.findIndex(
        (e) => e.id === destination.droppableId
      );
      const sourceCol = data[sourceColIndex];
      const destinationCol = data[destinationColIndex];
      
      const sourceTask = [...sourceCol.tasks];
      const destinationTask = [...destinationCol.tasks];

      // 動かしはじめたタスクを削除
      const [removed] = sourceTask.splice(source.index, 1);
      //動かした後のカラムにタスクを追加
      destinationTask.splice(destination.index, 0, removed);

      data[sourceColIndex].tasks = sourceTask;
      data[destinationColIndex].tasks = destinationTask;
      setData(data);
    } else {
      //同じカラム内のタスクの入れ替え
      const sourceColIndex = data.findIndex((e) => e.id === source.droppableId);
      console.log(sourceColIndex);
      const sourceCol = data[sourceColIndex];
      console.log(sourceCol);

      const sourceTask = [...sourceCol.tasks];
      // タスクを削除
      const [removed] = sourceTask.splice(source.index, 1);
      // タスクを追加
      sourceTask.splice(destination.index, 0, removed);

      data[sourceColIndex].tasks = sourceTask;
      setData(data);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className='trello'>
        {data.map(section => (
          <Droppable key={section.id} droppableId={section.id}>
            {(provided) => (
              <div
                className='trello-section'
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div className='trello-section-title'>{section.title}</div>
                <div className='trello-section-content'>
                  {section.tasks.map((task, index) => (
                    <Draggable
                      draggableId={task.id}
                      index={index}
                      key={task.id}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            opacity: snapshot.isDragging ? "0.3" : "1",
                          }}
                        >
                          <Card>{task.title}</Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}

export default Main