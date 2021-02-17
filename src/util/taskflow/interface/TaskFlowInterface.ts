export default  interface TaskFolwInterface {
    /**
    * 
    *按照优先级注册task. 
    * @param priority 优先级 > 0.
    * @param task 执行的方法.
    * @returns 任务的ID.
    */
   addTask (priority: number, task: Function): number;

   /**
    * 总任务队列中删除任务.
    * @param taskId 被删除的任务的 taskId.
    */
   deleteTask (taskId:number): void;

   /**
    * 按照优先级执行task.
    */
   runTask(time: number): void;


   clearAll(): void ;

   runTasks(taskIdList: number[]): void
}