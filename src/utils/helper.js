const getPublishYearOfPost = (post) =>
  String(new Date(post.node.frontmatter.date).getFullYear());

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export const getShortDate = (d) => {
  const date = new Date(d);
  const month = monthNames[date.getMonth()].slice(0, 3);
  const day = String(date.getDate());
  return day.length === 1 ? `${month} 0${day}` : `${month} ${day}`;
};

export const indexPostsByYear = (posts) => {
  const postsIndexedByYears = {};
  const uniqueYearsSet = new Set();
  posts.map((post) => uniqueYearsSet.add(getPublishYearOfPost(post)));
  const uniqueYearsArray = Array.from(uniqueYearsSet);
  uniqueYearsArray.map((i) => {
    postsIndexedByYears[`${i}`] = [];
    return null;
  });
  posts.map((post) => {
    const year = getPublishYearOfPost(post);
    postsIndexedByYears[`${year}`].push(post);
    return null;
  });
  return postsIndexedByYears;
};
