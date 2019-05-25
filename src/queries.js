import {gql} from 'apollo-boost'

export const SIGN_UP=gql`
    mutation Signup(
        $idNumber:String!,
        $name:String,
        $phoneNumber:String,
        $password:String!
    ){
        signup(
            idNumber:$idNumber,
            password: $password,
            name: $name,
            phoneNumber:$phoneNumber,
            role: RESIDENT
        ){
            token
            user{
                id
                name
                idNumber
                phoneNumber
            }
        }
    }
`;

export const LOGIN=gql`
    mutation Login(
        $idNumber:String!,
        $password:String!
    ){
        login(
            idNumber:$idNumber,
            password:$password
        ){
            token
            user{
                id
                name
                idNumber
                phoneNumber
                role
            }
        }
    }
`;

export const ALL_RESIDENTS=gql`
    query AllResident{
        users(where:{role:RESIDENT}){
            id
            idNumber
            name
            phoneNumber
            sex
            address{
                building
                unit
                room
            }
        }
    }
`;

export const CREATE_RESIDENTS=gql`
  mutation CreateResident(
      $idNumber:String!,
      $name:String!,
      $phoneNumber:String!,
      $sex:Sex!,
      $building:Int!,
      $unit:Int!,
      $room:Int!
  ){
  createResident(
      name:$name,
      phoneNumber:$phoneNumber,
      idNumber:$idNumber,
      sex:$sex,
      building:$building,
    	room:$room,
    	unit:$unit
  ){
    id
    idNumber
    name
    phoneNumber
    sex
    address{
      building
      unit
      room
    }
  }
}`;

export const UPDATE_RESIDENT=gql`
    mutation UpdateResident(
        $id:ID!,
        $idNumber:String,
        $name:String,
        $phoneNumber:String,
        $sex:Sex,
        $building:Int,
        $unit:Int,
        $room:Int
    ){
        updateResident(
            id:$id,
            name:$name,
            phoneNumber:$phoneNumber,
            idNumber:$idNumber,
            sex:$sex,
            building:$building,
            unit:$unit,
            room:$room
        ){
            id
            name
            phoneNumber
            idNumber
            sex
            address{
                building
                unit
                room
            }
        }
    }
`;

export const DELETE_RESIDENT=gql`
    mutation DeleteResident($id:ID){
        deleteUser(where: {id: $id}){
            id
        }
    }
`;

export const CREATE_ADVICE=gql`
    mutation createAdvice(
        $id:ID!,
        $title:String!,
        $content:String!
    ){
        createAdvice(
            data:{owner:{connect:{id:$id}},
            title:$title,
            content:$content
        }){
            id
            title
            content
            owner{
                id
                name
            }
            createdAt
        }
    }
`;

export const QUERY_RESIDENT_ADVICE=gql`
    query queryAdvices($id:ID!){
        advices(where:{owner:{id:$id}}){
            id
            title
            content
            createdAt
        }
    }
`;

export const ADVICE_AND_OWNER=gql`
    query adviceAndOwner($id:ID!){
        advice(where:{id:$id}){
            id
            title,
            content,
            owner{
                id
                name
            }
            createdAt
        }
    }
`;

export const CREATE_COMMENT_FOR_ADVICE=gql`
    mutation createReplyForAdvice(
        $ownerId:ID!,
        $adviceId:ID!,
        $comment:String!
    ){
        createComment(
            data:{
                owner:{connect:{id:$ownerId}},
                advice:{connect:{id:$adviceId}},
                content:$comment
            }
        ){
            id
            content
            createdAt
            owner{
                id
                name
                role
            }
        }
    }   
`;

export const ALL_COMMENTS_OF_ADVICE=gql`
    query commentsOfAdvice($id:ID!){
        comments(where:{advice:{id:$id}}){
            id
            content
            createdAt
            owner{
                id
                name
                role
            }
        }
    }
`;

export const CREATE_WORKER=gql`
    mutation createWorker(
        $name:String!,
        $phoneNumber:String!,
        $idNumber:String!,
        $password:String!
    ){
        createWorker(
            name:$name,
            password:$password,
            idNumber:$idNumber,
            phoneNumber:$phoneNumber
        ){
            id
            idNumber
            name
            phoneNumber
            password
        }
    }
`;

export const UPDATE_WORKER=gql`
    mutation updateWorker(
        $id:ID!,
        $name:String!,
        $phoneNumber:String!,
        $idNumber:String!,
        $password:String!
    ){
        updateUser(
            where:{id:$id},
            data:{
                name:$name,
                phoneNumber:$phoneNumber,
                idNumber:$idNumber,
                password:$password
            }){
                id
                name
                idNumber
                password
                phoneNumber
        }
    }
`;

export const ALL_WORKERS=gql`
    query allWorker{
        users(where:{role:WORKER}){
            id
            name
            idNumber
            phoneNumber
        }
    }
`;

export const DELETE_WORKER=gql`
    mutation deleteWorker($id:ID!){
        deleteUser(where:{id:$id}){
            id
        }
    }
`;

export const CREATE_ACTIVITY=gql`
    mutation createActivity(
        $id:ID!,
        $title:String!,
        $content:String!,
        $place:String!,
        $startAt:DateTime!
    ){
        createActivity(
            data:{
                title:$title,
                content:$content,
                place:$place,
                startAt:$startAt,
                status:PENDING
                owner:{connect:{id:$id}}
            }
        ){
            id
            title
            content
            place
            startAt
            status
            owner{
                id
            }
        }
    }
`;

export const DELETE_ACTIVITY=gql`
    mutation deleteActivity($id:ID){
        deleteActivity(where:{id:$id}){
            id
        }
    }
`;

export const MY_ACTIVITIES=gql`
    query myActivities($id:ID){
        activities(where:{owner:{id:$id}}){
            id
            title
            content
            place
            startAt
            status
            owner{
                id
                name
            }
        }
    }
`;

export const ALL_ACTIVITIES=gql`
    query allActivities{
        activities{
            id
            title
            content
            place
            startAt
            status
            owner{
                id
                name
            }
        }
    }
`;

export const ALL_ADVICE=gql`
    query allAdvice{
        advices{
            id
            title
            content
            createdAt
        }
    }
`;

export const ROLE_OF_USER=gql`
    query roleOfUser($id:ID){
        user(where:{id:$id}){
            role
        }
    }
`;

export const ME=gql`
    query me{
        me{
            name
            role
        }
    }
`;

export const GET_ADVICE_BY_ROLE=gql`
    query getAdvicesByRole($id:ID!){
        getAdvicesByRole(id:$id){
            id
            title
            content
            createdAt
        }
    }
`;

export const GET_ACTIVITY_BY_ID=gql`
    query getActivityById($id:ID!){
        activity(where:{id:$id}){
            id
            title
            content
            reply
            place
            status
            startAt
        }
    }
`;

export const UPDATE_ACTIVITY_TIME=gql`
    mutation updateActivityTime(
        $id:ID!,
        $startAt:DateTime!
    ){
        updateActivity(
            where: {id: $id},
            data: {startAt:$startAt}
        ){
            id
            title
            content
            place
            startAt
            status
            owner{
                id
                name
            }
        }
    }
`;

export const UPDATE_ACTIVITY_STATUS=gql`
    mutation updateActivityStatus(
        $id:ID!,
        $reply:String!,
        $status:Status!
    ){
        updateActivity(
            where: {id: $id},
            data: {
                status: $status,
                reply: $reply
            }
        ){
            id
            title
            content
            place
            startAt
            status
            owner{
                id
                name
            }
        }
    }
`;

export const UPLOAD_FILE=gql`
    mutation uploadFile ($file: Upload!) {
        singleUpload (file: $file) {
            id
            path
            filename
            mimetype
            encoding
        }
    }
`;

export const FILES=gql`
    query files {
        files: uploads {
            id
            path
            filename
            mimetype
            encoding
        }
    }
`;
