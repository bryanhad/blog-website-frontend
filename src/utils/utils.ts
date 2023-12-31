import format from 'date-fns/format'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'

export function formatDate(dateString: string) {
    return format(new Date(dateString), 'MMM d, yyyy')
}

export function generateSlug(input: string) {
    return input
        .replace(/[^a-zA-Z0-9 ]/g, '') //replace other characters that is not a lowercase, uppercase, number, or space into empty string
        .trim() //trim white space
        .replace(/ +/g, ' ') //replace multiple spaces into a single space string
        .replace(/\s/g, '-') //replace single space with a '-'
        .toLowerCase()
}

export function formatRelativeDate(dateString: string) {
    return formatDistanceToNowStrict(new Date(dateString), {
        addSuffix: true, //add the suffix like '1 hour ago', '2 hours ago', or '10 minutes ago'
    })
}

export function isServer() {
    return typeof window === 'undefined' //we don't check the window object it self.. cuz on the server, it is litterally not exists.. so we can check the type of it instead to get the value of undefined if it is on the server
}