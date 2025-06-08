import os

root_directory = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
output_file = os.path.join(root_directory, 'Achitecture', 'all_io_music_contents.txt')
file_extensions = ['.txt', '.css', '.tsx', '.java']

directories_to_search = [
    os.path.join(root_directory, 'music-ui'),
    os.path.join(root_directory, 'playlists'),
    os.path.join(root_directory, 'search'),
    os.path.join(root_directory, 'songs-and-albums'),
    os.path.join(root_directory, 'user-service')
]

def read_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

all_contents = []

for directory in directories_to_search:
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)

            if file.endswith(tuple(file_extensions)):
                if ('music-ui' in root and (file.endswith('.txt') or file.endswith('.css') or file.endswith('.tsx'))) or ('io/music' in root and file.endswith('.java')):
                    try:
                        content = read_file(file_path)
                        header = f"--- File: {file} ---\n"
                        all_contents.append(header + content + "\n\n")
                    except Exception as e:
                        print(f"Error reading file {file_path}: {e}")

with open(output_file, 'w', encoding='utf-8') as output:
    output.writelines(all_contents)

print(f"All contents have been written to {output_file}")
