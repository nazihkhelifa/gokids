interface Driver {
  id: string;
  name: string;
  rating: number;
  bio: string;
  image: string;
  reviews: Array<{
    name: string;
    since: string;
    comment: string;
    image: string;
  }>;
}

export const drivers: Driver[] = [
  {
    id: "d1",
    name: "Anil Kumar",
    rating: 4.8,
    bio: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    image: "/api/placeholder/100/100",
    reviews: [
      {
        name: "Sourabh Mangal",
        since: "2018",
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        image: "/api/placeholder/50/50",
      },
      {
        name: "Arpita Joshi",
        since: "2019",
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        image: "/api/placeholder/50/50",
      },
      {
        name: "Rahul Sharma",
        since: "2020",
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        image: "/api/placeholder/50/50",
      },
    ],
  },

  {
    id: "d2",
    name: "Anil Kumar3",
    rating: 4.2,
    bio: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    image: "/api/placeholder/100/100",
    reviews: [
      {
        name: "Sourabh Mangal",
        since: "2012",
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        image: "/api/placeholder/50/50",
      },
      {
        name: "Arpita Joshi",
        since: "2017",
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        image: "/api/placeholder/50/50",
      },
      {
        name: "Rahul Sharma",
        since: "2018",
        comment:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        image: "/api/placeholder/50/50",
      },
    ],
  },
  // ... other drivers
];
