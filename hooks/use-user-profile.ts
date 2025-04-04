import {gql, useQuery} from "@apollo/client";

const GET_ME_GRAPH_QUERY = gql`
    query Me {
        me {
            displayImages(types: PROFILE) {
                displayImageType
                imageUrl
            }
            name
            id
            email
            userName
        }
    }
`;

export function useUserProfile() {
    return useQuery(GET_ME_GRAPH_QUERY, {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: "cache-first",
    });
}
