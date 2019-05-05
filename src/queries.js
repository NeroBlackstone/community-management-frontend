import {gql} from 'apollo-boost'

export const SIGN_UP=gql`
    mutation Signup($idNumber:String!,$name:String,$phoneNumber:String,$password:String!){
        signup(idNumber:$idNumber,password: $password,name: $name,phoneNumber:$phoneNumber,role: RESIDENT){
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
    mutation Login($idNumber:String!,$password:String!){
        login(idNumber:$idNumber,password:$password){
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
  mutation CreateResident($idNumber:String!,$name:String!,$phoneNumber:String!,$sex:Sex!,$building:Int!,$unit:Int!,$room:Int!){
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
    mutation UpdateResident($id:ID!,$idNumber:String,$name:String,$phoneNumber:String,$sex:Sex,$building:Int,$unit:Int,$room:Int){
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